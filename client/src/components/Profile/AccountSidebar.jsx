const AccountSidebar = ({ clickedTab, setClickedTab }) => {
	const options = [
		{ key: "orders", label: "Orders" },
		{ key: "personalInfo", label: "Personal Information" },
		{ key: "addressBook", label: "Address Book" },
	];

	// Find the label of the currently selected tab

	return (
		<>
			{/* md and above → normal sidebar */}
			<div className='hidden md:flex p-6 md:w-[20vw] md:max-h-[40vh] flex-col bg-white space-y-1 shadow-lg font-semibold text-gray-800'>
				<h1 className='font-Lora text-xl'>My Account</h1>
				<div className='p-3 space-y-2'>
					{options.map((opt) => (
						<div
							key={opt.key}
							onClick={() => setClickedTab(opt.key)}
							className={`cursor-pointer ${
								clickedTab === opt.key ? "text-yellow-600" : ""
							}`}
						>
							{opt.label}
						</div>
					))}
				</div>
			</div>

			{/* smaller screens → dropdown with breadcrumb */}
			<div className='md:hidden p-4 w-full bg-white shadow-md'>
				<label className='block font-Lora text-lg text-gray-800 mb-2'>
					My Account
				</label>
			</div>
		</>
	);
};

export default AccountSidebar;
