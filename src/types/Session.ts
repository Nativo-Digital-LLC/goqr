export interface SessionProps {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	userId: string;
	user: {
		$id: string;
		$createdAt: string;
		$updatedAt: string;
		name: string;
		hashOptions?: object;
		status: boolean;
		labels: string[];
		email: string;
		phone: string;
		emailVerification: boolean;
		phoneVerification: boolean;
		mfa: boolean;
		accessedAt: string;
	}
	expire: string;
	provider: string;
	providerUid: string;
	providerAccessToken: string;
	providerAccessTokenExpiry: string;
	providerRefreshToken: string;
	factors: string[];
}

export interface SessionStoreProps {
	session: SessionProps | null;
	setSession: (session: SessionProps | null) => void;
}
