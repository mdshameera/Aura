const gradients = [
	"radial-gradient(circle at 20% 20%, #f9d423, #ff4e50)",
	"radial-gradient(circle at 80% 20%, #24c6dc, #5433ff)",
	"radial-gradient(circle at 50% 80%, #f7971e, #ffd200)",
	"radial-gradient(circle at 80% 80%, #43cea2, #185a9d)",
	"radial-gradient(circle at 50% 50%, #ffaf7b, #d76d77)",
	"radial-gradient(circle at 30% 70%, #c471f5, #fa71cd)",
	"radial-gradient(circle at 70% 30%, #30cfd0, #330867)",
	"radial-gradient(circle at 60% 60%, #f857a6, #ff5858)",
];
// Use product._id or title to get a consistent random gradient per product
export function pickGradient(key) {
	let hash = 0;
	for (let i = 0; i < key.length; i++) {
		hash = key.charCodeAt(i) + ((hash << 5) - hash);
	}
	return gradients[Math.abs(hash) % gradients.length];
}
