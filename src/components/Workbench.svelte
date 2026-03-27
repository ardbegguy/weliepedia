<script lang="ts">
	// ── reactive state ────────────────────────────────────────────
	let seedLie = $state('');
	let liar = $state('amber');
	let victim = $state('protima');
	let modelIdx = $state(1);
	let creativityIdx = $state(75);
	let detailDensity = $state(40.5);
	let apiKey = $state('');
	let tone = $state('Clinical');
	let elaboration = $state(7);
	let lang = $state('EN');
	let activeNav = $state('Rankings');

	// ── static data ───────────────────────────────────────────────
	const models = ['GPT-3.5 (DRAFTER)', 'GPT-4 (FABRICATOR)', 'CLAUDE 3 (NARRATOR)'];
	const langs = ['EN', 'हिं', 'Hinglish'];

	// ── helpers ───────────────────────────────────────────────────
	const prevModel = () => (modelIdx = (modelIdx - 1 + models.length) % models.length);
	const nextModel = () => (modelIdx = (modelIdx + 1) % models.length);

	/**
	 * Returns a CSS custom-property string consumed by the ::webkit-slider-runnable-track rule:
	 *   background: linear-gradient(to right, #F56F42 var(--fill-pct), #D1D1D1 var(--fill-pct))
	 */
	function sliderBg(val: number, min = 0, max = 100): string {
		const pct = ((val - min) / (max - min)) * 100;
		return `--fill-pct:${pct}%`;
	}

	/**
	 * Indicator line rotation per tone.
	 * Figma baseline: Clinical = rotate(45deg) at left:138px,top:62px in 238px container.
	 * transform-origin: -19px 57px  →  pivots around dial centre (119,119).
	 * Each other tone is ±90° from Clinical.
	 */
	const toneRotation: Record<string, number> = {
		Professional: -45, // 12 o'clock
		Clinical: 45, // 3 o'clock  (Figma default)
		Desperate: 135, // 6 o'clock
		Chaotic: 225 // 9 o'clock
	};

	function generateLie() {
		console.log('Generating:', seedLie);
	}
</script>

<!-- ═══════════════════════════════════════════════════════════════
     WORKBENCH  –  single-column PWA layout
════════════════════════════════════════════════════════════════ -->
<div class="relative min-h-screen bg-background-light pb-24 font-mono select-none">
	<!-- ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  STICKY DARK HEADER  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ -->
	<header
		class="sticky top-0 z-40 flex items-center justify-between bg-background-dark px-5 py-3"
		style="box-shadow: 4px 4px 10px rgba(0,0,0,0.9), -4px -4px 10px rgba(40,40,40,0.8)"
	>
		<!-- Left: waveform icon -->
		<button class="flex items-center gap-2 text-[#999999]" aria-label="menu">
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" d="M2 12 Q5 6 8 12 Q11 18 14 12 Q17 6 20 12" />
				<path stroke-linecap="round" stroke-opacity="0.4" d="M2 17h2M20 17h2" />
			</svg>
		</button>

		<!-- Center: logo -->
		<h1
			class="font-display text-xl font-bold tracking-tight text-primary select-none"
			style="letter-spacing:-0.03em"
		>
			Weliepedia
		</h1>

		<!-- Right: equalizer bars + SN -->
		<div class="flex items-center gap-3">
			<span class="hidden font-mono text-[9px] tracking-widest text-[#96CCFF] opacity-40 sm:block">
				SN: ALBI-001
			</span>
			<!-- Equalizer icon -->
			<div class="flex h-5 items-end gap-[3px] text-[#999999]">
				<div class="w-[3px] rounded-sm bg-current" style="height:40%"></div>
				<div class="w-[3px] rounded-sm bg-current" style="height:80%"></div>
				<div class="w-[3px] rounded-sm bg-current" style="height:60%"></div>
				<div class="w-[3px] rounded-sm bg-current" style="height:100%"></div>
				<div class="w-[3px] rounded-sm bg-current" style="height:55%"></div>
			</div>

			<!-- Language switcher -->
			<div
				class="flex items-center gap-0.5 rounded-md px-2 py-1"
				style="box-shadow: inset 1px 1px 3px rgba(60,60,60,1), inset -1px -1px 3px rgba(50,50,50,0.8)"
			>
				{#each langs as l, i (l)}
					<button
						onclick={() => (lang = l)}
						class="rounded px-1 py-0.5 font-mono text-[9px] tracking-wider transition-all"
						class:text-primary={lang === l}
						class:font-bold={lang === l}
						class:text-[#666666]={lang !== l}
					>
						{l}
					</button>
					{#if i < langs.length - 1}
						<span class="text-[9px] text-[#555555]">/</span>
					{/if}
				{/each}
			</div>
		</div>
	</header>

	<!-- ▄▄▄▄▄▄▄▄▄▄▄▄▄▄  SCROLLABLE CONTENT  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄ -->
	<main class="mx-auto flex max-w-[480px] flex-col gap-4 px-3 py-4">
		<!-- ╔════════════════════════════════════════╗
		     ║      1. INTERROGATION PANEL           ║
		     ╚════════════════════════════════════════╝ -->
		<div
			class="overflow-hidden rounded-3xl"
			style="background:#FFF9EE; border:2px solid rgba(255,255,255,0.7); box-shadow:6px 6px 14px rgba(49,92,170,0.15),-6px -6px 14px rgba(255,255,255,0.9)"
		>
			<!-- Panel header -->
			<div class="px-5 pt-5 pb-4" style="border-bottom:2px solid rgba(49,92,170,0.08)">
				<h2
					class="font-display text-[38px] leading-[1.1] font-bold text-[#315CAA] uppercase"
					style="letter-spacing:-0.05em"
				>
					INTERROGATION.
				</h2>
				<p class="mt-1 font-mono text-[9px] font-bold tracking-[0.3em] text-[#136397] uppercase">
					Calibrating Truth-Seeker Modules...
				</p>
				<p class="mt-2 font-mono text-[10px] leading-[1.5] text-[#315CAA] opacity-80">
					You told a little fib. We'll make it airtight.<br />
					Feed us the lie — we'll build the world around it.
				</p>
			</div>

			<!-- Liar + Victim row -->
			<div class="grid grid-cols-2 gap-3 px-4 pt-4">
				<!-- THE LIAR -->
				<div class="flex flex-col gap-1.5">
					<div class="flex items-center gap-1.5">
						<div class="h-4 w-1 rounded-sm bg-[#875200]"></div>
						<span class="font-mono text-[10px] font-black text-[#315CAA] uppercase">THE LIAR:</span>
					</div>
					<div
						class="rounded-xl px-3 py-2.5"
						style="background:#1E1E1E;box-shadow:inset 4px 4px 8px rgba(0,0,0,0.9),inset -4px -4px 8px rgba(40,40,40,0.8)"
					>
						<input
							type="text"
							bind:value={liar}
							placeholder="name..."
							class="w-full border-none bg-transparent font-mono text-[10px] tracking-widest text-primary capitalize outline-none placeholder:text-primary/30"
						/>
					</div>
				</div>

				<!-- THE VICTIM -->
				<div class="flex flex-col gap-1.5">
					<div class="flex items-center gap-1.5">
						<div class="h-4 w-1 rounded-sm bg-[#136397]"></div>
						<span class="font-mono text-[10px] font-black text-[#315CAA] uppercase"
							>THE VICTIM:</span
						>
					</div>
					<div
						class="rounded-xl px-3 py-2.5"
						style="background:#1E1E1E;box-shadow:inset 4px 4px 8px rgba(0,0,0,0.9),inset -4px -4px 8px rgba(40,40,40,0.8)"
					>
						<input
							type="text"
							bind:value={victim}
							placeholder="name..."
							class="w-full border-none bg-transparent font-mono text-[10px] tracking-widest text-primary capitalize outline-none placeholder:text-primary/30"
						/>
					</div>
				</div>
			</div>

			<!-- Source Narrative textarea -->
			<div class="flex flex-col gap-1.5 px-4 pt-3 pb-4">
				<label class="font-mono text-[10px] tracking-[0.1em] text-[#C4C7CA] uppercase">
					Enter Source Narrative
				</label>
				<div class="relative">
					<textarea
						bind:value={seedLie}
						placeholder="CONFESS YOUR ALIBI..."
						rows="5"
						class="w-full resize-none rounded-2xl border-none px-5 py-4 font-sans text-sm text-[#44474A] outline-none placeholder:text-[#44474A]/40"
						style="background:#060F15;box-shadow:inset 0 4px 12px rgba(0,0,0,0.5)"
					></textarea>
					<span
						class="pointer-events-none absolute right-4 bottom-3 font-mono text-[8px] text-[#44474A]/40 uppercase"
					>
						Buffer: 4096 KB
					</span>
				</div>
			</div>
		</div>
		<!-- END INTERROGATION PANEL -->

		<!-- ╔════════════════════════════════════════╗
		     ║      2. RADIO CONSOLE — FREQ. TUNER   ║
		     ╚════════════════════════════════════════╝ -->
		<div
			class="overflow-hidden rounded-3xl"
			style="background:#F8F6F5;border:1px solid rgba(230,230,230,0.6);box-shadow:-8px -8px 16px rgba(255,255,255,1),8px 8px 16px rgba(209,207,206,1)"
		>
			<!-- Traffic-light dots + SN -->
			<div class="flex items-center justify-between px-5 pt-4 pb-1">
				<span class="font-mono text-[8px] tracking-widest text-[#999999] opacity-50"
					>SN: 883-ALIBI</span
				>
				<div class="flex items-center gap-1.5">
					<div
						class="h-3 w-3 rounded-full bg-[#FF5F57]"
						style="box-shadow:0 0 4px rgba(255,95,87,0.6)"
					></div>
					<div
						class="h-3 w-3 rounded-full bg-[#FFBD2E]"
						style="box-shadow:0 0 4px rgba(255,189,46,0.5)"
					></div>
					<div
						class="h-3 w-3 rounded-full bg-[#28CA41]"
						style="box-shadow:0 0 4px rgba(40,202,65,0.5)"
					></div>
				</div>
			</div>

			<!-- ── Header: FREQ. TUNER + TONE CALIBRATION strip ── -->
			<div class="flex flex-col items-center gap-2 pt-1 pb-3">
				<!-- Figma: Space Grotesk 700, 30px, line-height 36px, letter-spacing 6px -->
				<h4
					class="text-center font-display font-bold text-background-dark uppercase"
					style="font-size:30px;line-height:36px;letter-spacing:6px"
				>
					FREQ. TUNER
				</h4>

				<!-- Border strip: 1px solid #999999, 4px corner squares -->
				<div class="relative flex items-center px-4 py-1" style="border:1px solid #999999">
					<div
						class="absolute bg-[#999999]"
						style="width:4px;height:4px;left:-1px;top:-1px;border-radius:2px"
					></div>
					<div
						class="absolute bg-[#999999]"
						style="width:4px;height:4px;right:-1px;top:-1px;border-radius:2px"
					></div>
					<!-- Figma: Space Grotesk 500, 14px, letter-spacing 1.4px -->
					<span
						class="font-display font-medium text-[#999999] uppercase"
						style="font-size:14px;line-height:20px;letter-spacing:1.4px">Tone Calibration</span
					>
				</div>
			</div>

			<!-- ── Dials row (tone dial + elaboration knob) ── -->
			<!--
				Figma dials layout: 557 × 240 px
				Scaled to ~0.75×  →  tone dial container 238px, knob 95px
				Overflow:visible lets cardinal labels bleed outside the container
			-->
			<div class="flex items-center justify-center px-10 pb-4" style="gap:40px;overflow:visible">
				<!-- MASTER TONE DIAL — 238px container (316.78px × 0.75) -->
				<div class="relative shrink-0" style="width:238px;height:238px;overflow:visible">
					<!-- Frequency arc ring extends −13px outside (−17.61 × 0.75) -->
					<div
						class="pointer-events-none absolute rounded-full"
						style="inset:-13px;border:2px dashed #999999;opacity:0.3"
					></div>

					<!--
						THE DIAL — 168px (224 × 0.75), centered at offset 35px each side.
						Figma: rotate(45deg), bg #F8F6F5,
						box-shadow: 4px 4px 8px #D1CFCE, -4px -4px 8px #FFFFFF,
						            inset 2px 2px 4px rgba(255,255,255,0.5)
					-->
					<div
						class="absolute overflow-hidden rounded-full"
						style="width:168px;height:168px;left:35px;top:35px;transform:rotate(45deg);background:#F8F6F5;box-shadow:4px 4px 8px #D1CFCE,-4px -4px 8px #FFFFFF,inset 2px 2px 4px rgba(255,255,255,0.5)"
					>
						<!-- Knurled edge texture (Figma: linear-gradient 45deg stripes, opacity 0.2) -->
						<div
							class="absolute inset-0 rounded-full"
							style="background:linear-gradient(45deg,#D4D4D4 0%,#D4D4D4 0.63%,#E6E6E6 0.63%,#E6E6E6 1.26%);opacity:0.2"
						></div>
						<!-- Metallic sheen ring -->
						<div
							class="absolute rounded-full"
							style="left:8px;right:4px;top:8px;bottom:4px;border:1px solid rgba(255,255,255,0.4);box-shadow:inset 0 2px 4px 1px rgba(0,0,0,0.05)"
						></div>
						<!--
							Inner Inset — 96px (128 × 0.75), centered at 36px offset.
							Figma: inset 6px 6px 12px #1A1A1A, inset -6px -6px 12px #323232
						-->
						<div
							class="absolute rounded-full"
							style="width:96px;height:96px;left:36px;top:36px;background:#F8F6F5;box-shadow:inset 6px 6px 12px #1A1A1A,inset -6px -6px 12px #323232"
						>
							<!-- Center Cap — 48px (64 × 0.75) -->
							<div
								class="absolute rounded-full"
								style="width:48px;height:48px;left:24px;top:24px;background:rgba(255,255,255,0.002);border:1px solid rgba(0,0,0,0.05);box-shadow:0 1px 2px rgba(0,0,0,0.05)"
							></div>
						</div>
					</div>
					<!-- END THE DIAL -->

					<!--
						INDICATOR LINE — 4px × 48px (6×0.75, 64×0.75).
						Figma position for Clinical: left:184.56px, top:82.73px → scaled: left:138px, top:62px.
						transform-origin: −19px 57px  →  rotates around dial centre (119,119).
						Each tone = Clinical baseline ± 90°.
					-->
					<div
						class="absolute rounded-full bg-primary"
						style="width:4px;height:48px;left:138px;top:62px;box-shadow:0 0 8px rgba(245,111,66,0.6);transform-origin:-19px 57px;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);transform:rotate({toneRotation[
							tone
						]}deg)"
					></div>

					<!-- Detent markers — N/S/E/W (3px × 9px vertical, 9px × 3px horizontal) -->
					<!-- N – Professional -->
					<div
						class="absolute rounded-full"
						style="width:3px;height:9px;left:117px;top:27px;background:{tone === 'Professional'
							? '#FF6A39'
							: '#999999'};{tone === 'Professional'
							? 'box-shadow:0 0 4px rgba(245,111,66,0.5)'
							: ''}"
					></div>
					<!-- E – Clinical -->
					<div
						class="absolute rounded-full"
						style="width:9px;height:3px;right:27px;top:117px;background:{tone === 'Clinical'
							? '#FF6A39'
							: '#999999'};{tone === 'Clinical' ? 'box-shadow:0 0 4px rgba(245,111,66,0.5)' : ''}"
					></div>
					<!-- S – Desperate -->
					<div
						class="absolute rounded-full"
						style="width:3px;height:9px;left:117px;bottom:27px;background:{tone === 'Desperate'
							? '#FF6A39'
							: '#999999'};{tone === 'Desperate' ? 'box-shadow:0 0 4px rgba(245,111,66,0.5)' : ''}"
					></div>
					<!-- W – Chaotic -->
					<div
						class="absolute rounded-full"
						style="width:9px;height:3px;left:27px;top:117px;background:{tone === 'Chaotic'
							? '#FF6A39'
							: '#999999'};{tone === 'Chaotic' ? 'box-shadow:0 0 4px rgba(245,111,66,0.5)' : ''}"
					></div>

					<!--
						Tone labels — cardinal positions.
						Figma: Space Grotesk 700, 14px, letter-spacing 1.4px, uppercase.
						Active = #F56F42, inactive = #999999.
						Positions scaled at 0.75 from Figma pixel coords.
					-->
					<!-- Professional  top-centre (left:101 × 0.75 = 76px, top: −9.61 × 0.75 ≈ −20px) -->
					<button
						onclick={() => (tone = 'Professional')}
						class="absolute cursor-pointer border-0 bg-transparent p-0 font-display font-bold whitespace-nowrap uppercase transition-colors"
						style="font-size:14px;letter-spacing:1.4px;left:76px;top:-20px;transform:translateX(-50%);color:{tone ===
						'Professional'
							? '#F56F42'
							: '#999999'}">Professional</button
					>

					<!-- Clinical  right (right: −33.61 × 0.75 ≈ −25px, top:46.84%) -->
					<button
						onclick={() => (tone = 'Clinical')}
						class="absolute cursor-pointer border-0 bg-transparent p-0 font-display font-bold whitespace-nowrap uppercase transition-colors"
						style="font-size:14px;letter-spacing:1.4px;right:-25px;top:46.84%;transform:translateY(-50%);color:{tone ===
						'Clinical'
							? '#F56F42'
							: '#999999'}">Clinical</button
					>

					<!-- Desperate  bottom-centre (left:114.78 × 0.75 = 86px, bottom: −20px) -->
					<button
						onclick={() => (tone = 'Desperate')}
						class="absolute cursor-pointer border-0 bg-transparent p-0 font-display font-bold whitespace-nowrap uppercase transition-colors"
						style="font-size:14px;letter-spacing:1.4px;left:86px;bottom:-20px;transform:translateX(-50%);color:{tone ===
						'Desperate'
							? '#F56F42'
							: '#999999'}">Desperate</button
					>

					<!-- Chaotic  left (left: −33.61 × 0.75 ≈ −25px, top:46.84%) -->
					<button
						onclick={() => (tone = 'Chaotic')}
						class="absolute cursor-pointer border-0 bg-transparent p-0 font-display font-bold whitespace-nowrap uppercase transition-colors"
						style="font-size:14px;letter-spacing:1.4px;left:-25px;top:46.84%;transform:translateY(-50%);color:{tone ===
						'Chaotic'
							? '#F56F42'
							: '#999999'}">Chaotic</button
					>
				</div>
				<!-- END MASTER TONE DIAL -->

				<!-- SECONDARY VOLUME KNOB (ELABORATION) — 95px × 137px (127.28 × 0.75, 183.19 × 0.75) -->
				<div class="relative shrink-0" style="width:95px;height:137px">
					<!-- "Elaboration Lvl" — Space Grotesk 700, 12px, letter-spacing 1.8px -->
					<span
						class="block text-center font-display font-bold text-background-dark uppercase"
						style="font-size:12px;line-height:16px;letter-spacing:1.8px;padding-bottom:32px"
						>Elaboration Lvl</span
					>

					<!--
						Scale arc — top-right quarter-circle border.
						Figma: 128px × 128px, border-right+top 2px solid #999999, opacity 0.4.
						Scaled: 96px, top:48px.
					-->
					<div
						class="absolute"
						style="width:96px;height:96px;left:0;top:48px;opacity:0.4;border-right:2px solid #999999;border-top:2px solid #999999;border-radius:0 9999px 0 0"
					></div>

					<!-- Scale labels: 1 (Inter 400, 12px), 10, and current value (Liberation Mono bold, orange) -->
					<span class="absolute font-sans text-[11px] text-[#999999]" style="left:0;top:80px"
						>1</span
					>
					<span class="absolute font-sans text-[11px] text-[#999999]" style="right:0;bottom:41px"
						>10</span
					>
					<!-- Current value — bold mono, orange, right:16px top:16px (Figma exact, unscaled) -->
					<span
						class="absolute font-mono text-[12px] font-bold text-primary"
						style="right:12px;top:16px">{elaboration}</span
					>

					<!--
						THE KNOB — 84px (112 × 0.75), left:5px top:53px, rotate(45deg).
						Same treatment as main dial: knurled + dark inner.
					-->
					<div
						class="absolute overflow-hidden rounded-full"
						style="width:84px;height:84px;left:5px;top:53px;transform:rotate(45deg);background:#F8F6F5;box-shadow:4px 4px 8px #D1CFCE,-4px -4px 8px #FFFFFF,inset 2px 2px 4px rgba(255,255,255,0.5)"
					>
						<!-- Knurled texture -->
						<div
							class="absolute inset-0 rounded-full"
							style="background:linear-gradient(45deg,#D4D4D4 0%,#D4D4D4 1.26%,#E6E6E6 1.26%,#E6E6E6 2.53%);opacity:0.15"
						></div>
						<!-- Overlay shadow -->
						<div
							class="absolute rounded-full"
							style="left:6px;right:3px;top:6px;bottom:3px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.05)"
						></div>
						<!-- Inner dark inset — 42px (56 × 0.75) -->
						<div
							class="absolute rounded-full"
							style="width:42px;height:42px;left:21px;top:21px;background:#F8F6F5;box-shadow:inset 6px 6px 12px #1A1A1A,inset -6px -6px 12px #323232"
						></div>
						<!--
							Indicator Dot — Figma: 8px circle at left:99px top:48.09px inside 112px knob.
							Scaled (× 0.75): ~6px at left:74px top:36px inside 84px knob.
						-->
						<div
							class="absolute rounded-full bg-primary"
							style="width:6px;height:6px;left:72px;top:35px;box-shadow:0 0 6px rgba(245,111,66,0.8)"
						></div>
					</div>

					<!-- Invisible range input overlaid for interaction -->
					<input
						type="range"
						min="1"
						max="10"
						step="1"
						bind:value={elaboration}
						class="absolute cursor-pointer opacity-0"
						style="width:84px;height:84px;left:5px;top:53px"
					/>
				</div>
				<!-- END ELABORATION KNOB -->
			</div>
			<!-- END DIALS ROW -->

			<!--
				READOUT SCREEN — Figma: 384px wide, 64px, bg #262626,
				border-width: 2px 0px (top + bottom only), border-color #1A1A1A,
				box-shadow: inset 6px 6px 12px #1A1A1A, inset -6px -6px 12px #323232,
				border-radius: 8px.
			-->
			<div class="mx-4 mt-1 mb-3">
				<div
					class="flex flex-col gap-1 rounded-lg px-4 py-3"
					style="background:#262626;border-width:2px 0;border-style:solid;border-color:#1A1A1A;box-shadow:inset 6px 6px 12px #1A1A1A,inset -6px -6px 12px #323232"
				>
					<!-- "CURRENT CONFIG" — Inter 400, 12px, letter-spacing 1.2px, #F56F42, opacity 0.8 -->
					<p
						class="font-sans text-primary uppercase"
						style="font-size:12px;letter-spacing:1.2px;opacity:0.8"
					>
						CURRENT CONFIG
					</p>
					<!-- "{TONE} / LVL {N}" — Inter 400, 18px, uppercase -->
					<div class="flex items-center" style="gap:12px">
						<span class="font-sans text-[#F8F6F5] uppercase" style="font-size:18px;line-height:28px"
							>{tone}</span
						>
						<span class="font-sans text-[#999999]" style="font-size:18px;line-height:28px">/</span>
						<span class="font-sans text-[#F8F6F5] uppercase" style="font-size:18px;line-height:28px"
							>LVL {String(elaboration).padStart(2, '0')}</span
						>
					</div>
				</div>
			</div>

			<!-- Console branding footer — Inter 400, 12px, letter-spacing 1.2px, opacity 0.6 -->
			<div class="flex justify-between px-5 pb-4" style="opacity:0.6">
				<span class="font-sans text-[#999999]" style="font-size:12px;letter-spacing:1.2px"
					>MOD: BRAUN-7A</span
				>
				<span class="font-sans text-[#999999]" style="font-size:12px;letter-spacing:1.2px"
					>SN: 883-ALIBI</span
				>
			</div>
		</div>
		<!-- END RADIO CONSOLE -->

		<!-- ╔════════════════════════════════════════╗
		     ║     3. SYSTEM BLUEPRINT CONSOLE       ║
		     ╚════════════════════════════════════════╝ -->
		<!--
			Figma: width 800px, padding 48px, gap 40px, border-radius 24px,
			background #E6E6E6, border 1px solid #E6E6E6,
			box-shadow: 12px 12px 24px #C4C4C4, -12px -12px 24px #FFFFFF
		-->
		<div
			class="relative flex flex-col gap-10 rounded-3xl bg-background-light p-8"
			style="border:1px solid #E6E6E6;box-shadow:12px 12px 24px #C4C4C4,-12px -12px 24px #FFFFFF"
		>
			<!--
				Decorative Hardware Screws — 4 corners, absolute positioned.
				Each: 12×12px, linear-gradient(135deg,#D4D4D4,#A3A3A3),
				box-shadow: 1px 1px 2px rgba(0,0,0,0.1), inset 1px 1px 2px #FFFFFF, inset -1px -1px 2px #7A7A7A
				border-radius: 6px. Each rotated differently.
				Inner "Horizontal Divider" cross-hair line per screw.
			-->
			<!-- Screw TL – rotate(15deg) -->
			<div class="pointer-events-none absolute top-4 left-4" aria-hidden="true">
				<div
					class="relative h-3 w-3 overflow-hidden rounded-[6px]"
					style="background:linear-gradient(135deg,#D4D4D4 0%,#A3A3A3 100%);box-shadow:1px 1px 2px rgba(0,0,0,0.1),inset 1px 1px 2px #FFFFFF,inset -1px -1px 2px #7A7A7A;transform:rotate(15deg)"
				>
					<div
						class="absolute h-[2px] bg-black/40"
						style="left:4.68px;right:0.1px;top:calc(50% - 1px);box-shadow:0 1px 0 rgba(255,255,255,0.4);transform:rotate(60deg)"
					></div>
				</div>
			</div>
			<!-- Screw TR – rotate(85deg) -->
			<div class="pointer-events-none absolute top-4 right-4" aria-hidden="true">
				<div
					class="relative h-3 w-3 overflow-hidden rounded-[6px]"
					style="background:linear-gradient(135deg,#D4D4D4 0%,#A3A3A3 100%);box-shadow:1px 1px 2px rgba(0,0,0,0.1),inset 1px 1px 2px #FFFFFF,inset -1px -1px 2px #7A7A7A;transform:rotate(85deg)"
				>
					<div
						class="absolute h-[2px] bg-black/40"
						style="left:3.42px;right:1.37px;top:calc(50% - 1px);box-shadow:0 1px 0 rgba(255,255,255,0.4);transform:rotate(130deg)"
					></div>
				</div>
			</div>
			<!-- Screw BL – rotate(110deg) -->
			<div class="pointer-events-none absolute bottom-4 left-4" aria-hidden="true">
				<div
					class="relative h-3 w-3 overflow-hidden rounded-[6px]"
					style="background:linear-gradient(135deg,#D4D4D4 0%,#A3A3A3 100%);box-shadow:1px 1px 2px rgba(0,0,0,0.1),inset 1px 1px 2px #FFFFFF,inset -1px -1px 2px #7A7A7A;transform:rotate(110deg)"
				>
					<div
						class="absolute h-[2px] bg-black/40"
						style="left:4px;right:0.79px;top:calc(50% - 1px);box-shadow:0 1px 0 rgba(255,255,255,0.4);transform:rotate(155deg)"
					></div>
				</div>
			</div>
			<!-- Screw BR – rotate(-45deg) -->
			<div class="pointer-events-none absolute right-4 bottom-4" aria-hidden="true">
				<div
					class="relative h-3 w-3 overflow-hidden rounded-[6px]"
					style="background:linear-gradient(135deg,#D4D4D4 0%,#A3A3A3 100%);box-shadow:1px 1px 2px rgba(0,0,0,0.1),inset 1px 1px 2px #FFFFFF,inset -1px -1px 2px #7A7A7A;transform:rotate(-45deg)"
				>
					<div
						class="absolute h-[2px] bg-black/40"
						style="left:4.88px;right:-0.1px;top:calc(50% - 1px);box-shadow:0 1px 0 rgba(255,255,255,0.4)"
					></div>
				</div>
			</div>

			<!-- Console header -->
			<!--
				Figma: heading "System Blueprint" — Space Grotesk 700, 36px, line-height 40px,
				letter-spacing -0.9px, uppercase, color #1A1A1A.
				Sub: Space Grotesk 400, 14px, letter-spacing 1.4px, color #999999.
			-->
			<div class="flex items-start justify-between gap-3 pt-2">
				<div class="flex flex-col gap-2">
					<h2
						class="font-display font-bold text-[#1A1A1A] uppercase"
						style="font-size:36px;line-height:40px;letter-spacing:-0.9px"
					>
						System Blueprint
					</h2>
					<p
						class="font-display font-normal text-[#999999]"
						style="font-size:14px;line-height:20px;letter-spacing:1.4px"
					>
						Advanced Parameters // SN: 883-ALIBI
					</p>
				</div>

				<!--
					CALIBRATING badge — Figma: bg rgba(245,111,66,0.1), border rgba(245,111,66,0.2),
					border-radius 16px, padding 8px 16px, gap 8px.
					Icon: 10.5×10.5px solid #F56F42 (no animate-pulse).
					Text: Space Grotesk 700, 12px, letter-spacing 0.6px, color #F56F42.
				-->
				<div
					class="flex shrink-0 items-center gap-2 px-4 py-2"
					style="background:rgba(245,111,66,0.1);border:1px solid rgba(245,111,66,0.2);border-radius:16px"
				>
					<div class="shrink-0 rounded-sm bg-[#F56F42]" style="width:10.5px;height:10.5px"></div>
					<span
						class="font-display font-bold text-[#F56F42]"
						style="font-size:12px;line-height:16px;letter-spacing:0.6px"
					>
						CALIBRATING
					</span>
				</div>
			</div>

			<!--
				Circuit Divider — Figma: 1px line, background #999999, opacity 0.3.
				Three 6×6px dots at left:0, left:25%, right:0, each top:-2.5px.
			-->
			<div class="relative h-px w-full" style="background:#999999;opacity:0.3">
				<div
					class="absolute rounded-[3px] bg-[#999999]"
					style="width:6px;height:6px;left:0;top:-2.5px"
				></div>
				<div
					class="absolute rounded-[3px] bg-[#999999]"
					style="width:6px;height:6px;left:25%;top:-2.5px"
				></div>
				<div
					class="absolute rounded-[3px] bg-[#999999]"
					style="width:6px;height:6px;right:0;top:-2.5px"
				></div>
			</div>

			<!-- ── SEC:01  CORE ENGINE ── -->
			<!--
				Section heading: Space Grotesk 700, 18px, line-height 28px, letter-spacing 0.45px, uppercase, #1A1A1A.
				SEC label: Space Grotesk 400, 12px, letter-spacing 0.6px, #999999.
			-->
			<section class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h3
						class="font-display font-bold text-[#1A1A1A] uppercase"
						style="font-size:18px;line-height:28px;letter-spacing:0.45px"
					>
						Core Engine
					</h3>
					<span
						class="font-display font-normal text-[#999999]"
						style="font-size:12px;letter-spacing:0.6px">SEC: 01</span
					>
				</div>

				<!--
					Model picker box — Figma: bg #262626,
					box-shadow: inset 6px 6px 12px #141414, inset -6px -6px 12px #383838,
					border-radius 4px, padding 24px, gap 24px.
					Includes a subtle orange radial glow (absolute overlay).
				-->
				<div
					class="relative flex items-center gap-6 overflow-hidden rounded p-6"
					style="background:#262626;box-shadow:inset 6px 6px 12px #141414,inset -6px -6px 12px #383838"
				>
					<!-- Subtle radial glow overlay -->
					<div
						class="pointer-events-none absolute inset-0"
						style="background:radial-gradient(50.93% 262.89% at 50% 50%,rgba(245,111,66,0.1) 0%,rgba(245,111,66,0) 70%)"
					></div>

					<div class="relative z-10 flex min-w-0 flex-1 flex-col gap-2">
						<!--
							"ACTIVE NEURAL PATHWAY" — Space Grotesk 400, 12px, #999999
						-->
						<p
							class="font-display font-normal text-[#999999]"
							style="font-size:12px;line-height:16px"
						>
							ACTIVE NEURAL PATHWAY
						</p>

						<!--
							Mechanical Dial Dropdown — Figma: 300px wide, 64px tall,
							bg linear-gradient(180deg,#2A2A2A,#1A1A1A),
							box-shadow: 0 2px 4px rgba(255,255,255,0.5), inset 0 8px 16px rgba(0,0,0,0.8),
							border-radius 8px.
							Inactive rows: Space Grotesk 400, 14px, letter-spacing 1.4px, opacity 0.3.
							Active row: Space Grotesk 700, 20px, letter-spacing 2px.
						-->
						<div
							class="relative overflow-hidden rounded-lg"
							style="background:linear-gradient(180deg,#2A2A2A,#1A1A1A);box-shadow:0 2px 4px rgba(255,255,255,0.5),inset 0 8px 16px rgba(0,0,0,0.8);height:64px"
						>
							<!-- Fade overlay top/bottom -->
							<div
								class="pointer-events-none absolute inset-0 z-10"
								style="background:linear-gradient(180deg,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0) 20%,rgba(0,0,0,0) 80%,rgba(0,0,0,0.6) 100%)"
							></div>

							<!-- Three rows: prev · active · next -->
							<div class="absolute inset-0 flex flex-col justify-center">
								<div class="py-0.5 text-center" style="opacity:0.3">
									<span
										class="font-display font-normal text-[#00FFAA]"
										style="font-size:14px;line-height:20px;letter-spacing:1.4px;text-shadow:0 0 8px rgba(0,255,170,0.5)"
									>
										{models[(modelIdx - 1 + models.length) % models.length]}
									</span>
								</div>
								<div class="py-0.5 text-center">
									<span
										class="font-display font-bold text-[#00FFAA]"
										style="font-size:20px;line-height:28px;letter-spacing:2px;text-shadow:0 0 8px rgba(0,255,170,0.5)"
									>
										{models[modelIdx]}
									</span>
								</div>
								<div class="py-0.5 text-center" style="opacity:0.3">
									<span
										class="font-display font-normal text-[#00FFAA]"
										style="font-size:14px;line-height:20px;letter-spacing:1.4px;text-shadow:0 0 8px rgba(0,255,170,0.5)"
									>
										{models[(modelIdx + 1) % models.length]}
									</span>
								</div>
							</div>

							<!-- Select arrows — Figma: absolute right:16px, opacity 0.5 -->
							<div
								class="absolute top-1/2 right-4 z-20 flex -translate-y-1/2 flex-col gap-2 opacity-50"
							>
								<button
									onclick={prevModel}
									class="text-[10px] leading-none text-white hover:opacity-100">▲</button
								>
								<button
									onclick={nextModel}
									class="text-[10px] leading-none text-white hover:opacity-100">▼</button
								>
							</div>
						</div>
					</div>

					<!--
						VerticalBorder stats — Figma: border-left 1px solid rgba(255,255,255,0.1), padding-left 24px.
						LATENCY / COHERENCE labels: Space Grotesk 400, 10px, #999999.
						Values: Space Grotesk 400, 14px. LATENCY=>#FFFFFF, COHERENCE=>#00FFAA.
					-->
					<div
						class="relative z-10 flex shrink-0 flex-col gap-4 pl-6"
						style="border-left:1px solid rgba(255,255,255,0.1)"
					>
						<div class="flex flex-col gap-1">
							<span
								class="font-display font-normal text-[#999999]"
								style="font-size:10px;line-height:15px">LATENCY</span
							>
							<span
								class="font-display font-normal text-white"
								style="font-size:14px;line-height:20px">42ms</span
							>
						</div>
						<div class="flex flex-col gap-1">
							<span
								class="font-display font-normal text-[#999999]"
								style="font-size:10px;line-height:15px">COHERENCE</span
							>
							<span
								class="font-display font-normal text-[#00FFAA]"
								style="font-size:14px;line-height:20px">98.4%</span
							>
						</div>
					</div>
				</div>
			</section>

			<!-- ── SEC:02  PARAMETER TUNING ── -->
			<section class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h3
						class="font-display font-bold text-[#1A1A1A] uppercase"
						style="font-size:18px;line-height:28px;letter-spacing:0.45px"
					>
						Parameter Tuning
					</h3>
					<span
						class="font-display font-normal text-[#999999]"
						style="font-size:12px;letter-spacing:0.6px">SEC: 02</span
					>
				</div>

				<!--
					Slider container — Figma: bg #F0F0F0,
					box-shadow: inset 4px 4px 8px #C4C4C4, inset -4px -4px 8px #FFFFFF,
					border-radius 4px, padding 32px, gap 40px.
				-->
				<div
					class="flex flex-col gap-10 rounded p-8"
					style="background:#F0F0F0;box-shadow:inset 4px 4px 8px #C4C4C4,inset -4px -4px 8px #FFFFFF"
				>
					<!-- Slider 1 · Creativity Engine -->
					<!--
						Heading 3: Space Grotesk 700, 14px, uppercase, #1A1A1A (no letter-spacing).
						Sub-label: Space Grotesk 400, 12px, #999999.
						Value badge: bg #E6E6E6, box-shadow inset 6px 6px 12px #D1D1D1, inset -6px -6px 12px #FFFFFF,
						border-radius 8px, padding 4px 12px.
						Value text: Space Grotesk 700, 14px, #F56F42.
					-->
					<div class="flex flex-col gap-4">
						<div class="flex items-end justify-between">
							<div class="flex flex-col gap-1">
								<span
									class="font-display font-bold text-[#1A1A1A] uppercase"
									style="font-size:14px;line-height:20px">Creativity Engine</span
								>
								<span
									class="font-display font-normal text-[#999999]"
									style="font-size:12px;line-height:16px">HALLUCINATION_IDX</span
								>
							</div>
							<div
								class="rounded-lg px-3 py-1"
								style="background:#E6E6E6;box-shadow:inset 6px 6px 12px #D1D1D1,inset -6px -6px 12px #FFFFFF"
							>
								<span
									class="font-display font-bold text-[#F56F42]"
									style="font-size:14px;line-height:20px">{creativityIdx.toFixed(1)}</span
								>
							</div>
						</div>
						<input
							type="range"
							min="0"
							max="100"
							step="0.5"
							bind:value={creativityIdx}
							class="w-full cursor-pointer"
							style={sliderBg(creativityIdx)}
						/>
						<div class="flex justify-between">
							<span
								class="font-display font-normal text-[#999999]"
								style="font-size:10px;line-height:15px">LITERAL</span
							>
							<span
								class="font-display font-normal text-[#999999]"
								style="font-size:10px;line-height:15px">FABRICATED</span
							>
						</div>
					</div>

					<!-- Internal circuit divider — Figma: 1px, #999999, opacity 0.2 -->
					<div class="h-px w-full bg-[#999999]" style="opacity:0.2"></div>

					<!-- Slider 2 · Detail Density -->
					<div class="flex flex-col gap-4">
						<div class="flex items-end justify-between">
							<div class="flex flex-col gap-1">
								<span
									class="font-display font-bold text-[#1A1A1A] uppercase"
									style="font-size:14px;line-height:20px">Detail Density</span
								>
								<span
									class="font-display font-normal text-[#999999]"
									style="font-size:12px;line-height:16px">GRANULARITY_LVL</span
								>
							</div>
							<div
								class="rounded-lg px-3 py-1"
								style="background:#E6E6E6;box-shadow:inset 6px 6px 12px #D1D1D1,inset -6px -6px 12px #FFFFFF"
							>
								<span
									class="font-display font-bold text-[#F56F42]"
									style="font-size:14px;line-height:20px">{detailDensity.toFixed(1)}</span
								>
							</div>
						</div>
						<input
							type="range"
							min="0"
							max="100"
							step="0.5"
							bind:value={detailDensity}
							class="w-full cursor-pointer"
							style={sliderBg(detailDensity)}
						/>
						<div class="flex justify-between">
							<span
								class="font-display font-normal text-[#999999]"
								style="font-size:10px;line-height:15px">SPARSE</span
							>
							<span
								class="font-display font-normal text-[#999999]"
								style="font-size:10px;line-height:15px">GRANULAR</span
							>
						</div>
					</div>
				</div>
			</section>

			<!-- ── SECURITY CLEARANCE ── -->
			<!--
				Figma: border-top 1px solid rgba(255,255,255,0.5), padding-top 16px, gap 16px.
				Heading: Space Grotesk 700, 18px, letter-spacing 0.45px, uppercase, #1A1A1A.
				API_KEY label: Space Grotesk 400, 14px, #999999.
				Input container: bg #F0F0F0, box-shadow inset 4px 4px 8px #C4C4C4, inset -4px -4px 8px #FFFFFF,
				border-radius 4px, padding 12px 16px.
				Submit button: 48×48px, bg #E6E6E6, box-shadow 8px 8px 16px #D1D1D1, -8px -8px 16px #FFFFFF, border-radius 8px.
				Top highlight: absolute 1px white line at top:1px.
			-->
			<section
				class="relative flex flex-col gap-4 pt-4"
				style="border-top:1px solid rgba(255,255,255,0.5)"
			>
				<div class="flex items-center justify-between">
					<h3
						class="font-display font-bold text-[#1A1A1A] uppercase"
						style="font-size:18px;line-height:28px;letter-spacing:0.45px"
					>
						Security Clearance
					</h3>
					<!-- Lock icon placeholder (Figma: 9.33×12.25px bg #999999) -->
					<div class="bg-[#999999]" style="width:9.33px;height:12.25px"></div>
				</div>

				<div class="flex items-center gap-4">
					<div
						class="flex min-w-0 flex-1 items-center gap-4 rounded px-4 py-3"
						style="background:#F0F0F0;box-shadow:inset 4px 4px 8px #C4C4C4,inset -4px -4px 8px #FFFFFF"
					>
						<span
							class="shrink-0 font-display font-normal text-[#999999]"
							style="font-size:14px;line-height:20px">API_KEY:</span
						>
						<input
							type="password"
							bind:value={apiKey}
							placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
							class="min-w-0 flex-1 border-none bg-transparent font-display font-normal text-[#1A1A1A] outline-none placeholder:text-[#999999]/50"
							style="font-size:14px;line-height:20px"
						/>
					</div>

					<button
						class="flex shrink-0 items-center justify-center rounded-lg bg-background-light"
						style="width:48px;height:48px;box-shadow:8px 8px 16px #D1D1D1,-8px -8px 16px #FFFFFF"
						aria-label="Apply API key"
					>
						<svg
							class="h-4 w-4 text-[#1A1A1A]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
							/>
						</svg>
					</button>
				</div>

				<!-- Subtle top highlight — Figma: absolute 1px white line -->
				<div
					class="pointer-events-none absolute h-px w-full bg-white"
					style="top:1px;left:0;right:0"
				></div>
			</section>

			<!-- ── FOOTER ACTIONS ── -->
			<!--
				RESTORE DEFAULTS: Space Grotesk 700, 14px, letter-spacing 0.7px, color #999999, padding 13px 24px, border-radius 16px.
				APPLY CONFIG: same font, color #F56F42 (orange), bg #E6E6E6, border 1px solid #FFFFFF,
				box-shadow: 8px 8px 16px #D1D1D1, -8px -8px 16px #FFFFFF, border-radius 16px, padding 12px 32px.
			-->
			<div class="flex items-center justify-end gap-4">
				<button
					class="font-display font-bold text-[#999999]"
					style="font-size:14px;line-height:20px;letter-spacing:0.7px;padding:13px 24px;border-radius:16px"
				>
					RESTORE DEFAULTS
				</button>
				<button
					class="font-display font-bold text-[#F56F42]"
					style="font-size:14px;line-height:20px;letter-spacing:0.7px;padding:12px 32px;border-radius:16px;background:#E6E6E6;border:1px solid #FFFFFF;box-shadow:8px 8px 16px #D1D1D1,-8px -8px 16px #FFFFFF"
				>
					APPLY CONFIG
				</button>
			</div>
		</div>
		<!-- END SYSTEM BLUEPRINT -->

		<!-- ╔════════════════════════════════════════╗
		     ║       4. GENERATE LIE BUTTON          ║
		     ╚════════════════════════════════════════╝ -->
		<!--
			Figma section: 851×812px. Key elements (all scaled ~0.56× for mobile):
			Outer Housing  : 672×672px, border-radius:48px, bg #E6E6E6,
			                 box-shadow: -10px -10px 30px #FFFFFF, 10px 10px 30px #D1D1D1
			Inner Bezel    : 537.59px circle, bg #E6E6E6, border 1px solid rgba(255,255,255,0.4),
			                 box-shadow: inset 6px 6px 12px 1px #D1D1D1, inset -6px -6px 12px 1px #FFFFFF
			Overlay ring   : 492.73px circle, border 1px solid rgba(203,213,225,0.2),
			                 same inset shadow as bezel
			Orange button  : 327.14px, bg #FF6A39,
			                 box-shadow: -2px -2px 10px rgba(255,255,255,0.4), 15px 15px 40px rgba(0,0,0,0.3)
			Ratios (relative sizing):
			  Bezel   = 537.59/672  = 79.94% of housing
			  Overlay = 492.73/537.59 = 91.66% of bezel
			  Button  = 327.14/492.73 = 66.39% of overlay
		-->
		<div class="flex justify-center">
			<!--
				Outer Housing — square via aspect-ratio:1, max 460px.
				border-radius:48px (Figma exact).
				Shadow order: white (-10,-10) then dark (10,10).
			-->
			<div
				class="relative flex items-center justify-center bg-background-light"
				style="width:min(460px,100%);aspect-ratio:1/1;border-radius:48px;border:1px solid rgba(225,191,181,0.1);box-shadow:-10px -10px 30px #FFFFFF,10px 10px 30px #D1D1D1"
			>
				<!--
					Status Indicator (Top Right)
					Figma: padding 8px 16px, gap 12px, border-radius 8px,
					bg rgba(232,232,232,0.5), border 1px solid rgba(255,255,255,0.2),
					backdrop-filter blur(6px), box-shadow 0 1px 2px rgba(0,0,0,0.05).
					LED: 12×12px, #BA1A1A, box-shadow: 0 0 8px #BA1A1A.
					Text: Space Grotesk 700, 12px, letter-spacing 2.4px, #59413A.
				-->
				<div
					class="absolute top-[5%] right-[5%] flex items-center gap-3 rounded-lg"
					style="padding:8px 16px;background:rgba(232,232,232,0.5);border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(6px);box-shadow:0 1px 2px rgba(0,0,0,0.05)"
				>
					<!-- Two-layer LED: outer glow ring + inner solid dot -->
					<div class="relative shrink-0" style="width:12px;height:12px">
						<div class="absolute inset-0 rounded-full bg-[#BA1A1A]" style="opacity:0.75"></div>
						<div
							class="absolute inset-0 rounded-full bg-[#BA1A1A]"
							style="box-shadow:0 0 8px #BA1A1A"
						></div>
					</div>
					<span
						class="font-display font-bold text-[#59413A]"
						style="font-size:12px;line-height:16px;letter-spacing:2.4px">SYNC_READY</span
					>
				</div>

				<!--
					Input_Authorization bar + label (bottom-left area).
					Bar: 64×4px, bg #AE3200 (Figma exact, no border-radius).
					Text: Space Grotesk 700, 10px, letter-spacing:1px, uppercase, #64748B.
				-->
				<div class="absolute bottom-[12%] left-[10%] flex flex-col gap-1">
					<div style="width:64px;height:4px;background:#AE3200"></div>
					<span
						class="font-display font-bold text-[#64748B] uppercase"
						style="font-size:10px;line-height:15px;letter-spacing:1px">Input_Authorization</span
					>
				</div>

				<!--
					S/N + VER text (bottom-right).
					Figma: Liberation Mono 700, 10px, line-height 15px, letter-spacing 3px, #1E293B.
				-->
				<div class="absolute right-[7%] bottom-[8%]">
					<span
						class="font-mono font-bold text-[#1E293B]"
						style="font-size:10px;line-height:15px;letter-spacing:3px;display:block;white-space:nowrap"
						>S/N: TC-2993-XFL</span
					>
					<span
						class="font-mono font-bold text-[#1E293B]"
						style="font-size:10px;line-height:15px;letter-spacing:3px;display:block;white-space:nowrap"
						>VER: 4.0.2-OMEGA</span
					>
				</div>

				<!--
					Inner Bezel — 79.94% of housing.
					bg #E6E6E6, border 1px solid rgba(255,255,255,0.4),
					box-shadow: inset 6px 6px 12px 1px #D1D1D1, inset -6px -6px 12px 1px #FFFFFF.
				-->
				<div
					class="flex items-center justify-center rounded-full bg-background-light"
					style="width:79.94%;height:79.94%;border:1px solid rgba(255,255,255,0.4);box-shadow:inset 6px 6px 12px 1px #D1D1D1,inset -6px -6px 12px 1px #FFFFFF"
				>
					<!--
						Overlay + Border + Shadow ring — 91.66% of bezel.
						bg rgba(255,255,255,0.002), border 1px solid rgba(203,213,225,0.2),
						same inset shadow as bezel.
					-->
					<div
						class="flex items-center justify-center rounded-full"
						style="width:91.66%;height:91.66%;background:rgba(255,255,255,0.002);border:1px solid rgba(203,213,225,0.2);box-shadow:inset 6px 6px 12px 1px #D1D1D1,inset -6px -6px 12px 1px #FFFFFF"
					>
						<!--
							The Tactical Toggle Button — 66.39% of overlay ring.
							bg #FF6A39, border-radius 9999px.
							box-shadow: -2px -2px 10px rgba(255,255,255,0.4),
							            15px 15px 40px rgba(0,0,0,0.3)  (white first, Figma order).
						-->
						<button
							onclick={generateLie}
							class="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full bg-primary transition-transform active:scale-[0.97]"
							style="width:66.39%;height:66.39%;box-shadow:-2px -2px 10px rgba(255,255,255,0.4),15px 15px 40px rgba(0,0,0,0.3)"
							aria-label="Generate Lie"
						>
							<!--
								Backlit Glow Effect (order 2 in Figma stack).
								linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%).
							-->
							<div
								class="pointer-events-none absolute inset-0 rounded-full"
								style="background:linear-gradient(135deg,rgba(255,255,255,0.2) 0%,rgba(255,255,255,0) 100%)"
							></div>

							<!--
								Icon & Label:margin — Figma: padding-bottom 16px, icon 40×50px white bg.
								We use a white lightning-bolt SVG.
							-->
							<div class="relative z-10 pb-4" style="width:40px;height:50px">
								<svg viewBox="0 0 40 50" fill="white" style="width:40px;height:50px">
									<path d="M26 2L6 28H20L16 48L38 20H24L26 2Z" />
								</svg>
							</div>

							<!--
								GENERATE LIE text.
								Figma: Space Grotesk 900, 30px, line-height 36px,
								letter-spacing -1.5px, uppercase, #FFFFFF.
								Single line in Figma; two lines used here for mobile readability.
							-->
							<span
								class="relative z-10 text-center font-display font-black text-white uppercase"
								style="font-size:30px;line-height:36px;letter-spacing:-1.5px">GENERATE LIE</span
							>

							<!--
								Inner light reflect — Figma:
								height:16px, left:25.22%, right:24.78%, top:-4.89px,
								bg rgba(255,255,255,0.2), filter:blur(6px),
								border-radius:9999px, transform:rotate(-15deg).
							-->
							<div
								class="pointer-events-none absolute rounded-full"
								style="height:16px;left:25.22%;right:24.78%;top:-4.89px;background:rgba(255,255,255,0.2);filter:blur(6px);transform:rotate(-15deg)"
							></div>
						</button>
					</div>
				</div>
			</div>
		</div>
		<!-- END GENERATE LIE -->

		<!-- ╔════════════════════════════════════════╗
		     ║        5. OUTPUT TERMINAL             ║
		     ╚════════════════════════════════════════╝ -->
		<div
			class="flex flex-col overflow-hidden rounded-3xl"
			style="background:#2A2A2A;min-height:220px;border:1px solid rgba(0,0,0,0.1);box-shadow:inset 6px 6px 12px 1px #1A1A1A,inset -6px -6px 12px 1px #3A3A3A"
		>
			<!-- Terminal header -->
			<div
				class="flex shrink-0 items-center justify-between px-5 py-3"
				style="border-bottom:1px solid rgba(255,255,255,0.1)"
			>
				<div class="flex items-center gap-2.5">
					<div class="flex gap-2">
						<div class="h-2 w-2 rounded-full" style="background:rgba(49,113,230,0.4)"></div>
						<div class="h-2 w-2 rounded-full" style="background:rgba(49,113,230,0.3)"></div>
						<div class="h-2 w-2 rounded-full" style="background:rgba(49,113,230,0.2)"></div>
					</div>
					<span class="font-mono text-xs tracking-[1.4px] text-[rgba(148,148,142,0.8)]"
						>OUTPUT_TERMINAL</span
					>
				</div>
				<div class="flex gap-1.5">
					<div class="h-1.5 w-1.5 rounded-full bg-white/15"></div>
					<div class="h-1.5 w-1.5 rounded-full bg-white/15"></div>
				</div>
			</div>

			<!-- Output body -->
			<div class="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">
				<!-- Notebook line rules -->
				<div
					class="pointer-events-none absolute inset-0"
					style="background:linear-gradient(180deg,rgba(255,255,255,0) 96.43%,rgba(255,255,255,0.02) 100%)"
				></div>
				<!-- Placeholder -->
				<p
					class="font-mono text-xs tracking-[1.4px] text-[rgba(249,245,237,0.9)] uppercase opacity-40 blur-[0.25px]"
				>
					Awaiting Parameters...
				</p>
			</div>

			<!-- Terminal footer -->
			<div
				class="flex shrink-0 items-end justify-between px-5 py-3"
				style="border-top:1px solid rgba(255,255,255,0.1)"
			>
				<div class="flex flex-col gap-1.5">
					<span class="font-mono text-[9px] text-[rgba(148,148,142,0.5)] uppercase">
						Believability Index
					</span>
					<div class="flex gap-1">
						{#each [0, 1, 2, 3] as i (i)}
							<div class="h-1 w-8 rounded-full" style="background:rgba(255,255,255,0.05)"></div>
						{/each}
					</div>
				</div>
				<button
					class="flex items-center gap-2 text-[rgba(148,148,142,0.5)] transition-colors hover:text-[rgba(148,148,142,0.8)]"
				>
					<span class="font-mono text-[12px]">COPY_SEQ</span>
					<span class="text-sm leading-none">⎘</span>
				</button>
			</div>
		</div>
		<!-- END OUTPUT TERMINAL -->
	</main>

	<!-- ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  FIXED BOTTOM NAV  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄ -->
	<nav
		class="fixed inset-x-0 bottom-0 z-50"
		style="box-shadow:6px 6px 16px rgba(0,0,0,0.9),-6px -6px 16px rgba(37,37,37,0.8)"
	>
		<div
			class="flex items-center justify-around bg-background-dark px-2"
			style="padding-bottom:max(12px, env(safe-area-inset-bottom))"
		>
			<!-- Home -->
			<button
				onclick={() => (activeNav = 'Home')}
				class="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all"
				style={activeNav === 'Home'
					? 'background:#1A1A1A;box-shadow:inset 4px 4px 8px rgba(0,0,0,1),inset -4px -4px 8px rgba(37,37,37,1)'
					: ''}
			>
				<svg
					class="h-5 w-5 transition-colors"
					class:text-primary={activeNav === 'Home'}
					class:text-[#6B7280]={activeNav !== 'Home'}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
					/>
				</svg>
				<span
					class="font-mono text-[9px] tracking-[0.15em] uppercase"
					class:text-primary={activeNav === 'Home'}
					class:text-[#6B7280]={activeNav !== 'Home'}>Home</span
				>
			</button>

			<!-- Library -->
			<button
				onclick={() => (activeNav = 'Library')}
				class="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all"
				style={activeNav === 'Library'
					? 'background:#1A1A1A;box-shadow:inset 4px 4px 8px rgba(0,0,0,1),inset -4px -4px 8px rgba(37,37,37,1)'
					: ''}
			>
				<svg
					class="h-5 w-5 transition-colors"
					class:text-primary={activeNav === 'Library'}
					class:text-[#6B7280]={activeNav !== 'Library'}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
					/>
				</svg>
				<span
					class="font-mono text-[9px] tracking-[0.15em] uppercase"
					class:text-primary={activeNav === 'Library'}
					class:text-[#6B7280]={activeNav !== 'Library'}>Library</span
				>
			</button>

			<!-- Rankings (default active) -->
			<button
				onclick={() => (activeNav = 'Rankings')}
				class="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all"
				style={activeNav === 'Rankings'
					? 'background:#1A1A1A;box-shadow:inset 4px 4px 8px rgba(0,0,0,1),inset -4px -4px 8px rgba(37,37,37,1)'
					: ''}
			>
				<svg
					class="h-5 w-5 transition-colors"
					class:text-primary={activeNav === 'Rankings'}
					class:text-[#6B7280]={activeNav !== 'Rankings'}
					fill={activeNav === 'Rankings' ? 'currentColor' : 'none'}
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
					/>
				</svg>
				<span
					class="font-mono text-[9px] tracking-[0.15em] uppercase"
					class:text-primary={activeNav === 'Rankings'}
					class:text-[#6B7280]={activeNav !== 'Rankings'}>Rankings</span
				>
			</button>

			<!-- Export -->
			<button
				onclick={() => (activeNav = 'Export')}
				class="flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all"
				style={activeNav === 'Export'
					? 'background:#1A1A1A;box-shadow:inset 4px 4px 8px rgba(0,0,0,1),inset -4px -4px 8px rgba(37,37,37,1)'
					: ''}
			>
				<svg
					class="h-5 w-5 transition-colors"
					class:text-primary={activeNav === 'Export'}
					class:text-[#6B7280]={activeNav !== 'Export'}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25"
					/>
				</svg>
				<span
					class="font-mono text-[9px] tracking-[0.15em] uppercase"
					class:text-primary={activeNav === 'Export'}
					class:text-[#6B7280]={activeNav !== 'Export'}>Export</span
				>
			</button>
		</div>
	</nav>
</div>
