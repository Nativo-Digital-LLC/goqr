import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ConfirmDialog({
	open,
	title,
	body,
	confirmLabel,
	onConfirm,
	onOpenChange,
	destructive,
	loading,
}: {
	open: boolean;
	title: string;
	body: string;
	confirmLabel: string;
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
	destructive?: boolean;
	loading?: boolean;
}) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{body}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
					<Button variant={destructive ? "destructive" : "default"} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
