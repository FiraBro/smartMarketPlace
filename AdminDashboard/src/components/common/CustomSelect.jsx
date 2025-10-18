import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function CustomSelect({ label, options, value, onChange }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full flex justify-between items-center px-3 py-2 border border-[#f9a03f]/40 rounded-lg focus:ring-2 focus:ring-[#f9a03f] bg-white text-gray-700 text-left">
            {options.find((opt) => opt.value === value)?.label || "Select..."}
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-[#f9a03f]/40 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none px-3 py-2 rounded-lg transition-colors duration-150
                    ${
                      active
                        ? "bg-[#f9a03f] text-white"
                        : selected
                        ? "bg-[#f9a03f]/20 text-gray-800"
                        : "text-gray-700"
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {selected && (
                        <CheckIcon className="h-4 w-4 text-[#f9a03f]" />
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
