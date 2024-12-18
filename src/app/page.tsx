"use client";

import Image from "next/image";
import { ConnectButton, useReadContract } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import CampaignCard from "./components/CampaignCard";

export default function Home() {

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY
  });

  const {data: campaigns, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useReadContract({
    contract: contract,
    method: "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: []
  });

  console.log(campaigns);

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-4">Campaigns:</h1>
      <div className="grid grid-cols-3 gap-4">
        {!isLoadingCampaigns && campaigns && (
          campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.campaignAddress}
                campaignAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <p>No Campaigns</p>
          )
        )}
      </div>
    </main>
  );
}
