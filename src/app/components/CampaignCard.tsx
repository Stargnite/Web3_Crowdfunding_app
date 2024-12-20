import Link from "next/link";
import { client } from "../client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type CampaignCardProps = {
	campaignAddress: string,
}

export default function CampaignCard({ campaignAddress }: CampaignCardProps) {
	const contract = getContract({
		client: client,
		chain: sepolia,
		address: campaignAddress
	});

	const { data: campaignName } = useReadContract({
		contract,
		method: "function name() view returns (string)",
		params: []
	});

	const { data: campaignDescription } = useReadContract({
		contract,
		method: "function description() view returns (string)",
		params: []
	});

	const { data: goal, isLoading: isLoadingGoal } = useReadContract({
		contract,
		method: "function goal() view returns (string)",
		params: []
	});

	const { data: balance, isLoading: isLoadingBalance } = useReadContract({
		contract,
		method: "function getContractBalance() view returns (uint256)",
		params: []
	});

	const totalBalance = balance?.toString() || "0"; // Default to "0" if undefined or null
	const totalGoal = goal?.toString() || "0";

	let balancePercentage = 0; // Default to 0%
	if (parseInt(totalGoal, 10) > 0) { // Avoid division by zero
		balancePercentage = (parseInt(totalBalance, 10) / parseInt(totalGoal, 10)) * 100;
	}
	balancePercentage = Math.min(balancePercentage, 100); // Cap at 100%



	// const totalBalance = balance?.toString();
	// const totalGoal = goal?.toString();
	// let balancePercentage = (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

	// if (balancePercentage >= 100) {
	// 	balancePercentage = 100;
	// }

	return (
		<div className="flex flex-col justify-between max-w-sm p-6 bg-gray-600 rounded-lg shadow-lg">
			<div>
				{!isLoadingBalance && (
					<div className="mb-4">
						<div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
							<div
								className="h-6 bg-blue-600 rounded-full dark:bg-blue-500 text-right"
								style={{ width: `${balancePercentage}%` }}
							>
								<p className="text-white dark:text-white text-xs p-1">
									${totalBalance}
								</p>
							</div>
							<p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1">
								{balancePercentage < 100 ? `${balancePercentage.toFixed(2)}%` : ""}
							</p>
						</div>
					</div>
				)}

				{/* {!isLoadingBalance && (
					<div className="mb-4">
						<div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
							<div className="h-6 bg-blue-600 rounded-full dark:bg-blue-500 text-right" style={{ width: `${balancePercentage?.toString()}%` }}>
								<p className="text-white dark:text-white text-xs p-1">
									${balance?.toString()}
								</p>
							</div>
							<p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1">
								{balancePercentage >= 100 ? "" : `${balancePercentage?.toString()}%`}
							</p>
						</div>
					</div>
				)} */}
				<h5 className="mb-2 text-2xl font-bold tracking-tight text-white">{campaignName}</h5>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{campaignDescription}</p>
			</div>
			<Link
				href={`/campaign/${campaignAddress}`}
				passHref={true}
			>
				<p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg transition-all ease-in-out hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
					View Campaign
					<svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
						<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
					</svg>
				</p>
			</Link>
		</div>
	)
}