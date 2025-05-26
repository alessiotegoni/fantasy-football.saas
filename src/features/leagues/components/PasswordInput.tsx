"use client";

import { Eye, EyeClosed } from "iconoir-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
}

export function PasswordInput({
  label = "Password",
  placeholder = "Es. Aurajacket89",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const { control } = useFormContext<{ password: string }>();

  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={placeholder}
                className="pr-17"
              />
            </FormControl>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword((prev) => !prev)}
              className="w-fit hover:bg-transparent absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeClosed className="size-6" />
              ) : (
                <Eye className="size-6" />
              )}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
