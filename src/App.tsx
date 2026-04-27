import rocketLaunch from "./assets/rocketlaunch.gif";

function App() {
	return (
		<main className="px-8 py-12 bg-zinc-800 min-h-dvh text-white">
			<div className="max-w-2xl mx-auto">
				<div className="bg-emerald-200/20 px-3 py-2 rounded-lg inline-flex items-center gap-1.5 mb-3">
					<div className="w-2.5 h-2.5 bg-emerald-200 rounded-full animate-pulse" />
					<span className="text-xs font-bold text-emerald-200">
						Novim zmagam naproti
					</span>
				</div>
				<h1 className="text-3xl font-black">Vse najboljše! 🥳</h1>
				<p className="mt-3 leading-relaxed text-sm">
					Naj novi izzivi prinesejo nove zmage. Nove vzpone, tudi nove padce.
					Predvsem pa veliko zadovoljstva na poti, ki je pred tabo!
				</p>
				<p className="mt-3 leading-relaxed text-sm">...več pa kmalu 😉</p>
				<div className="mt-4">
					<img
						alt="rocket-launch"
						className="object-cover w-full"
						src={rocketLaunch}
					/>
				</div>
				<div className="mt-4 text-right">
					<span className="text-sm">&mdash; Lan, Ajs, Sara in Žiga</span>
				</div>
			</div>
		</main>
	);
}

export default App;
