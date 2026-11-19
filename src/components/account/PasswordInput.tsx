import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

export const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, ...props }, ref) => {
		const [visible, setVisible] = React.useState(false);
		return (
			<div className="relative flex">
				<Input ref={ref} type={visible ? "text" : "password"} className={`pr-12 ${className ?? ""}`} {...props} />
				<button
					type="button"
					onClick={() => setVisible((v) => !v)}
					aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
					className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-xl text-muted-foreground focus-visible:outline-2 focus-visible:outline-primary"
				>
					{visible ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
				</button>
			</div>
		);
	}
);
PasswordInput.displayName = "PasswordInput";
