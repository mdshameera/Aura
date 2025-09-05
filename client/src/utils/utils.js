export const statusStyles = {
	pending: {
		bg: "bg-orange-200",
		text: "text-orange-700",
		label: "Pending", // Order placed but not yet processed
	},
	processing: {
		bg: "bg-blue-200",
		text: "text-blue-700",
		label: "Processing", // Payment verified, preparing shipment
	},
	shipped: {
		bg: "bg-indigo-200",
		text: "text-indigo-700",
		label: "Shipped", // Handed over to courier
	},
	delivered: {
		bg: "bg-green-200",
		text: "text-green-700",
		label: "Delivered", // Package delivered successfully
	},
	cancelled: {
		bg: "bg-red-200",
		text: "text-red-700",
		label: "Cancelled", // Cancelled by user or admin
	},
	returned: {
		bg: "bg-yellow-200",
		text: "text-yellow-700",
		label: "Returned", // Customer returned after delivery
	},
};
export const paymentStatusStyles = {
	pending: {
		bg: "bg-orange-200",
		text: "text-orange-700",
		label: "Payment Pending", // Order placed, payment not completed
	},
	paid: {
		bg: "bg-green-200",
		text: "text-green-700",
		label: "Payment Success", // Payment received
	},
	failed: {
		bg: "bg-red-200",
		text: "text-red-700",
		label: "Payment Failed", // Transaction failed
	},
	refunded: {
		bg: "bg-yellow-200",
		text: "text-yellow-700",
		label: "Payment Refunded", // Payment refunded after cancellation/return
	},
};
