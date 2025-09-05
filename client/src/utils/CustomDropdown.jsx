import { Fragment } from "react";
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Transition,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

const CustomDropdown = ({ label, options, value, onChange }) => {
	return (
		<div className='relative w-40'>
			<Listbox value={value} onChange={onChange}>
				<div className='relative'>
					{/* Floating label */}
					{label !== "" && (
						<label
							className={`absolute left-2 top-1 transition-all text-gray-700 pointer-events-none
              ${
								value
									? "top-0 text-xs text-yellow-500"
									: "top-5 text-base text-gray-500"
							}`}
						>
							{label}
						</label>
					)}

					{/* Trigger button */}
					<ListboxButton
						className='w-full border px-3 pt-5 pb-1 text-sm 
                       border-gray-300 bg-white focus:outline-none
                       flex justify-between items-center cursor-pointer'
					>
						<span>{value || ""}</span>
						<ChevronDown className='h-4 w-4 text-gray-500' />
					</ListboxButton>

					{/* Options dropdown */}
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<ListboxOptions
							className='absolute w-full bg-white shadow-md z-10 
                         max-h-60 overflow-auto ring-1 ring-black/5 focus:outline-none'
						>
							{options.map((opt, idx) => (
								<ListboxOption
									key={idx}
									value={opt}
									className={({ active }) =>
										`cursor-pointer select-none relative py-2 pl-3 text-sm border-b border-gray-200 ${
											active ? "text-yellow-700" : "text-gray-900"
										}`
									}
								>
									{({ selected }) => (
										<>
											<span
												className={`block truncate ${
													selected ? "font-semibold" : "font-normal"
												}`}
											>
												{opt}
											</span>
										</>
									)}
								</ListboxOption>
							))}
						</ListboxOptions>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
};

export default CustomDropdown;
