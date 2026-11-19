import { PanelHeader } from "./components/PanelHeader";

export default function SoonPage({ title, body }: { title: string; body: string }) {
	return (
		<>
			<PanelHeader title={title} />
			<div className="mt-6 rounded-2xl border border-border bg-card p-6 text-[15px] text-muted-foreground">{body}</div>
		</>
	);
}
