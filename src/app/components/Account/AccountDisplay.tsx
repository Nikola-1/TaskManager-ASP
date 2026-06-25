"use client";

import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccountField from "./AccountField";
import { updateUserProfile } from "@/app/services/userService";
import toast from "react-hot-toast";

interface AccountDisplayComponentProps {
  visible?: boolean;
}

const AccountDisplay = ({ visible }: AccountDisplayComponentProps) => {
  const { user, setUser } = useAuth();

  const [edit, setEdit] = useState(false);

  const [formData, setFormData] = useState({
    Name: user?.Name ?? "",
    Surname: user?.Surname ?? "",
    Username: user?.Username ?? "",
    Email: user?.email ?? "",
    Password: user?.Password ?? "",
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function enableEdit(ref: React.RefObject<HTMLInputElement>) {
    setEdit(true);

    setTimeout(() => {
      ref.current?.focus();
    }, 0);
  }

  function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async function sendEmailNotification(email: string) {
    const code = generateVerificationCode();

    localStorage.setItem("verificationCode", code);

    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: email,
        subject: "Reset-password code",
        text: `Dear ${user?.Username}, your verification code is: ${code}`,
      }),
    });
  }

  async function saveChanges() {
    if (!user?.id) return;

    try {
      const updatedUser = await updateUserProfile(user.id, {
        Name: formData.Name,
        Surname: formData.Surname,
        Username: formData.Username,
      });

      setUser(updatedUser);
      setEdit(false);

      console.log("User updated successfully:", updatedUser);
    } catch (error) {
      console.log("Error updating user:", error);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInside =
        nameRef.current?.contains(target) ||
        surnameRef.current?.contains(target) ||
        usernameRef.current?.contains(target);

      if (!clickedInside) {
        setEdit(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-4 w-fit">
        <AccountField
          label="Name"
          value={formData.Name}
          readOnly={!edit}
          ref={nameRef}
          onChange={(value) => handleChange("Name", value)}
          onEdit={() => enableEdit(nameRef)}
        />

        <AccountField
          label="Surname"
          value={formData.Surname}
          readOnly={!edit}
          ref={surnameRef}
          onChange={(value) => handleChange("Surname", value)}
          onEdit={() => enableEdit(surnameRef)}
        />

        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="password" className="text-sm">
              Password:
            </label>
            <input
              className="outline-none"
              type="password"
              value={formData.Password}
              readOnly
            />
          </div>

          <Link
            onClick={() =>{sendEmailNotification(user?.email ?? "");} }
            href="/pages/VerifyCode"
          >
            <FontAwesomeIcon
              icon={faEdit}
              className="ml-2 text-white cursor-pointer bg-blue-500 rounded-md p-3 hover:bg-blue-700"
            />
          </Link>
        </div>

        <AccountField
          label="Email"
          type="email"
          value={formData.Email}
          readOnly
          showEditButton={false}
        />

        <AccountField
          label="Username"
          value={formData.Username}
          readOnly={!edit}
          ref={usernameRef}
          onChange={(value) => handleChange("Username", value)}
          onEdit={() => enableEdit(usernameRef)}
        />
      </div>

      <button
        className="bg-blue-300 text-white px-4 py-2 rounded hover:bg-blue-500"
        onClick={saveChanges}
      >
        Save changes
      </button>
    </div>
  );
};

export default AccountDisplay;