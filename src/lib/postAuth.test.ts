import { describe, expect, it } from "vitest";

import { postAuthPath } from "./postAuth";

describe("postAuthPath", () => {
	it.each([
		[[], "/onboarding"],
		[[{ onboardingStep: 1 }], "/onboarding"],
		[[{ onboardingStep: 2 }], "/onboarding"],
		[[{ onboardingStep: 3 }], "/onboarding"],
		[[{ onboardingStep: null }], "/dashboard"],
		[[{}], "/dashboard"],
		[[{ onboardingStep: 4 }], "/dashboard"],
	])("%j -> %s", (establishments, path) => {
		expect(postAuthPath(establishments)).toBe(path);
	});
});
