const Order = require(
  "../models/orderModel"
);

const createOrder =
  async (req, res) => {
    try {

      const order =
        await Order.create({
          orderItems:
            req.body.orderItems,

          shippingAddress:
            req.body.shippingAddress,

          paymentMethod:
            req.body.paymentMethod,

          totalPrice:
            req.body.totalPrice,

          isPaid:
            req.body.isPaid || false,

          paidAt:
            req.body.paidAt,

          paymentId:
            req.body.paymentId,
        });

      res.status(201).json({
        success: true,
        order,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

const getOrders =
  async (req, res) => {
    try {

      const orders =
        await Order.find()
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        orders,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

module.exports = {
  createOrder,
  getOrders,
};