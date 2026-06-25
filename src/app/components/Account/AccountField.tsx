import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type AccountFieldProps = {
  label: string;
  type?: string;
  value: string;
  readOnly: boolean;
  showEditButton?: boolean;
  onChange?: (value: string) => void;
  onEdit?: () => void;
};

const AccountField = React.forwardRef<HTMLInputElement, AccountFieldProps>(
  (
    {
      label,
      type = "text",
      value,
      readOnly,
      showEditButton = true,
      onChange,
      onEdit,
    },
    ref
  ) => {
    return (
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm">{label}:</label>
          <input
            ref={ref}
            className="outline-none"
            type={type}
            value={value}
            readOnly={readOnly}
            onChange={(e) => onChange?.(e.currentTarget.value)}
          />
        </div>

        {showEditButton && (
          <FontAwesomeIcon
            icon={faEdit}
            onClick={onEdit}
            className="ml-2 text-white cursor-pointer bg-blue-500 rounded-md p-3 hover:bg-blue-700"
          />
        )}
      </div>
    );
  }
);

AccountField.displayName = "AccountField";

export default AccountField;