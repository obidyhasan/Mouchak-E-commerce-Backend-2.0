/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "./../product/product.model";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { IOrder, IOrderLog, ORDER_STATUS } from "./order.interface";
import { Order } from "./order.model";
import AppError from "../../errors/AppError";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { Cart } from "../cart/cart.model";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import { sendEmail } from "../../utils/sendEmail";
import { generateOrderId } from "../../utils/generateOrderId";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { orderSearchableFields } from "./order.constant";

// const createOrder = async (
//   decodedToken: JwtPayload,
//   payload: Partial<IOrder>
// ) => {
//   const isUserExits = await User.findById(decodedToken.userId);
//   if (!isUserExits)
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not exits!");

//   const isCartsExits = await Cart.find({ _id: { $in: payload.carts } });
//   if (isCartsExits.length !== payload.carts?.length)
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       "One or more carts do not exits!"
//     );

//   const totalAmount = isCartsExits.reduce((sum, cart) => sum + cart.amount, 0);

//   for (const cart of isCartsExits) {
//     const isProductExits = await Product.findById(cart.product);
//     if (!isProductExits)
//       throw new AppError(httpStatus.NOT_FOUND, "Product not found!");
//   }

//   const orderLog: IOrderLog = {
//     status: ORDER_STATUS.Pending,
//     timestamp: new Date(),
//     updateBy: decodedToken.userId,
//     note: "Order request successfully. Current status is Pending.",
//   };

//   payload.orderId = generateOrderId();
//   payload.statusLogs = [orderLog];
//   payload.totalAmount = totalAmount;

//   const createOrder = await Order.create({
//     ...payload,
//     user: decodedToken.userId,
//   });

//   // Create Invoice

//   const order = await Order.findById(createOrder._id)
//     .populate({
//       path: "carts",
//       populate: {
//         path: "product", // Assuming cart.product is ObjectId of Product
//         model: "Product",
//         select: "name price", // select only needed fields
//       },
//     })
//     .populate("user");

//   if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order does not found");

//   const user = await User.findById(order.user);
//   if (!user) throw new AppError(httpStatus.NOT_FOUND, "User does not found");

//   const invoiceData: IInvoiceData = {
//     orderId: order.orderId,
//     orderDate: order.createdAt as Date,
//     userName: user.name as string,
//     totalAmount: order.totalAmount,
//     products: order.carts.map((cart: any) => ({
//       name: cart.product.name,
//       quantity: cart.quantity,
//       price: cart.product.newPrice,
//     })),
//   };

//   const pdfBuffer = await generatePdf(invoiceData);

//   const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");

//   await Order.findByIdAndUpdate(
//     createOrder._id,
//     { invoiceUrl: cloudinaryResult?.secure_url },
//     { runValidators: true }
//   );

//   const additionalData = {
//     userEmail: user.email,
//     invoiceDownloadUrl: cloudinaryResult?.secure_url,
//   };

//   const templateData = {
//     ...invoiceData,
//     ...additionalData,
//   };

//   console.log(user.email);

//   try {
//     await sendEmail({
//       to: user.email,
//       subject: "Your Order Invoice",
//       templateName: "invoice",
//       templateData,
//       attachments: [
//         {
//           filename: "invoice.pdf",
//           content: pdfBuffer,
//           contentType: "application/pdf",
//         },
//       ],
//     });
//   } catch (err) {
//     console.error("Failed to send invoice email:", err);
//     // Optionally decide if this should throw or be logged silently
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to send email"
//     );
//   }

//   return createOrder;
// };

const createOrder = async (
  decodedToken: JwtPayload,
  payload: Partial<IOrder>
) => {
  // 1️⃣ Check if user exists
  const isUserExits = await User.findById(decodedToken.userId);
  if (!isUserExits)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!");

  // 2️⃣ Check if carts exist
  const isCartsExits = await Cart.find({ _id: { $in: payload.carts } });
  if (isCartsExits.length !== payload.carts?.length)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "One or more carts do not exist!"
    );

  // 3️⃣ Validate products inside carts
  for (const cart of isCartsExits) {
    const isProductExits = await Product.findById(cart.product);
    if (!isProductExits)
      throw new AppError(httpStatus.NOT_FOUND, "Product not found!");
  }

  // 4️⃣ Calculate subtotal and shipping
  const subtotal = isCartsExits.reduce((sum, cart) => sum + cart.amount, 0);

  const shippingCost = payload.shippingCost || 0;
  const totalAmount = subtotal + shippingCost;

  // 5️⃣ Create order log
  const orderLog: IOrderLog = {
    status: ORDER_STATUS.Pending,
    timestamp: new Date(),
    updateBy: decodedToken.userId,
    note: "Order request successfully. Current status is Pending.",
  };

  payload.orderId = generateOrderId();
  payload.statusLogs = [orderLog];
  payload.totalAmount = totalAmount;
  payload.shippingCost = shippingCost;

  // 6️⃣ Create the order
  const createOrder = await Order.create({
    ...payload,
    user: decodedToken.userId,
  });

  // 7️⃣ Populate order for invoice
  const order = await Order.findById(createOrder._id)
    .populate({
      path: "carts",
      populate: {
        path: "product",
        model: "Product",
        select: "name price",
      },
    })
    .populate("user");

  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  const user = await User.findById(order.user);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  // 8️⃣ Prepare invoice data
  const invoiceData: IInvoiceData = {
    orderId: order.orderId,
    orderDate: order.createdAt as Date,
    userName: user.name as string,
    userEmail: user.email as string,
    products: order.carts.map((cart: any) => ({
      name: cart.product.name,
      quantity: cart.quantity,
      price: cart.product.price,
    })),
    subtotal, // sum of (price * quantity)
    shippingCost, // shipping fee
    totalAmount: subtotal + shippingCost, // ✅ include totalAmount
  };
  // 9️⃣ Generate PDF & upload to Cloudinary
  const pdfBuffer = await generatePdf(invoiceData);
  const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice");

  await Order.findByIdAndUpdate(
    createOrder._id,
    { invoiceUrl: cloudinaryResult?.secure_url },
    { runValidators: true }
  );

  // 10️⃣ Prepare template data for email
  const templateData = {
    ...invoiceData,
    userEmail: user.email,
    invoiceDownloadUrl: cloudinaryResult?.secure_url,
  };

  // 11️⃣ Send invoice email
  try {
    await sendEmail({
      to: user.email,
      subject: "Your Order Invoice",
      templateName: "invoice",
      templateData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    await sendEmail({
      to: "dev.obidyhasan@gmail.com",
      subject: "Your Have A New Order Invoice",
      templateName: "invoice",
      templateData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (err) {
    console.error("Failed to send invoice email:", err);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send email"
    );
  }

  return createOrder;
};

const getAllOrders = async (query: Record<string, string>) => {
  // const orders = await Order.find({})
  //   .sort({ createdAt: -1 })
  //   .populate("user", "name email")
  //   .populate({
  //     path: "carts",
  //     populate: {
  //       path: "product",
  //       model: "Product", // must match your model name
  //     },
  //   });
  // const totalOrders = await Order.countDocuments();

  const queryBuilder = new QueryBuilder(
    Order.find({})
      .populate("user", "name email")
      .populate({
        path: "carts",
        populate: {
          path: "product",
          model: "Product",
        },
      }),
    query
  );
  const parcels = queryBuilder
    .search(orderSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    parcels.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getMyOrders = async (decodedToken: JwtPayload) => {
  const isUserExits = await User.findById(decodedToken.userId);
  if (!isUserExits)
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exits!");

  const orders = await Order.find({ user: decodedToken.userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "carts",
      populate: {
        path: "product",
        model: "Product", // must match your model name
      },
    });

  const totalOrders = await Order.countDocuments({ user: decodedToken.userId });

  return {
    data: orders,
    meta: {
      total: totalOrders,
    },
  };
};

const updateOrder = async (
  orderId: string,
  payload: Partial<IOrder>,
  decodedToken: JwtPayload
) => {
  const isOrderExits = await Order.findById(orderId);
  if (!isOrderExits)
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exits!");

  const isUserExits = await User.findById(isOrderExits.user);
  if (!isUserExits)
    throw new AppError(httpStatus.NOT_FOUND, "User does not exits!");

  if (
    isUserExits._id.toString() !== decodedToken.userId &&
    decodedToken.role === Role.USER
  )
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");

  if (isOrderExits.status === ORDER_STATUS.Cancelled) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't update status ${payload.status}. Because order current status is ${isOrderExits.status}`
    );
  }

  if (payload.status === ORDER_STATUS.Pending) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't update status ${payload.status}. Because order current status is ${isOrderExits.status}`
    );
  }

  if (
    payload.status === ORDER_STATUS.Confirm ||
    payload.status === ORDER_STATUS.Picked ||
    payload.status === ORDER_STATUS.InTransit ||
    payload.status === ORDER_STATUS.Delivered ||
    payload.status === ORDER_STATUS.Cancelled
  ) {
    if (
      decodedToken.role !== Role.SUPER_ADMIN &&
      decodedToken.role !== Role.ADMIN
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        `You can't update status ${payload.status}. Because you are not authorized!`
      );
    }
  }

  if (
    payload.status === ORDER_STATUS.Delivered &&
    decodedToken.role === Role.USER
  ) {
    if (isOrderExits.status !== ORDER_STATUS.InTransit) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can't update status ${payload.status}. Because order current status is ${isOrderExits.status}`
      );
    }
  }

  if (payload.status === ORDER_STATUS.Confirm) {
    if (isOrderExits.status !== ORDER_STATUS.Pending) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can't update status ${payload.status}. Because order current status is ${isOrderExits.status}`
      );
    }
  }

  if (payload.status === ORDER_STATUS.Picked) {
    if (isOrderExits.status !== ORDER_STATUS.Confirm) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can't update status ${payload.status}. Because order current status is ${isOrderExits.status}`
      );
    }
  }

  if (payload.status === ORDER_STATUS.InTransit) {
    if (isOrderExits.status !== ORDER_STATUS.Picked) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can't update status ${payload.status}.Because order current status is ${isOrderExits.status}`
      );
    }
  }

  if (payload.status === ORDER_STATUS.Cancelled) {
    if (isOrderExits.status === ORDER_STATUS.Delivered) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can't update status ${payload.status}.Because order current status is ${isOrderExits.status}`
      );
    }
  }

  if (payload.paymentStatus && decodedToken.role === Role.USER) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `You are not authorized for this payment stats update.`
    );
  }

  if (payload.status) {
    const orderLog: IOrderLog = {
      status: payload.status as ORDER_STATUS,
      timestamp: new Date(),
      updateBy: decodedToken.userId,
      note: `Order request successfully. Current status is ${payload.status}.`,
    };

    const updateParcelLog = [
      ...(isOrderExits.statusLogs as IOrderLog[]),
      orderLog,
    ];

    payload.statusLogs = updateParcelLog;
  }

  const updateOrder = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
    runValidators: true,
  });

  return updateOrder;
};

const deleteOrder = async (orderId: string, decodedToken: JwtPayload) => {
  const isOrderExits = await Order.findById(orderId);
  if (!isOrderExits)
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exits!");

  const isUserExits = await User.findById(decodedToken.userId);
  if (!isUserExits)
    throw new AppError(httpStatus.NOT_FOUND, "User does not exits");

  await Order.findByIdAndDelete(orderId);
};

const getInvoiceDownloadUrl = async (orderId: string) => {
  const order = await Order.findById(orderId).select("invoiceUrl");

  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  if (!order.invoiceUrl)
    throw new AppError(httpStatus.NOT_FOUND, "No invoice found");

  return order.invoiceUrl;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrder,
  deleteOrder,
  getInvoiceDownloadUrl,
};
