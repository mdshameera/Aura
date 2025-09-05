import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddressBlock from "./AddressBlock";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import AddressModify from "./AddressModify";

const AddressBook = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [type, setType] = useState("");
	const [editData, setEditData] = useState(null);
	const { user } = useSelector((state) => state.user);

	return (
		<div>
			<div>
				<h3 className='text-4xl max-md:text-xl text-center text-gray-800 font-Lora'>
					Address Book
				</h3>
				<p className='text-center text-gray-800 text-sm font-Source'>
					Save all your addresses for a faster checkout experience
				</p>
				{isOpen && (
					<div
						className='fixed inset-0 opacity-50 bg-black z-40'
						onClick={() => setIsOpen(false)}
					></div>
				)}
				<div className='grid md:grid-cols-3 md:gap-5 grid-cols-1 gap-2 mt-5'>
					<div
						className='flex space-x-1 md:w-[15vw] md:h-[25vh] font-semibold text-sm items-center justify-center rounded-sm border-gray-200 border p-2 hover:cursor-pointer'
						onClick={() => {
							setIsOpen(true);
							setType("new");
						}}
					>
						<MdOutlineAddLocationAlt />
						Add new address
					</div>
					{user?.addresses?.length > 0 &&
						user?.addresses?.map((it, idx) => (
							<div
								key={idx}
								className=''
								onClick={() => {
									setType("edit");
									setEditData(it);
								}}
							>
								<AddressBlock address={it} setIsOpen={setIsOpen} />
							</div>
						))}
				</div>
			</div>
			{setIsOpen && (
				<AddressModify
					type={type}
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					user={user}
					editData={type === "edit" ? editData : null}
				/>
			)}
		</div>
	);
};

export default AddressBook;
