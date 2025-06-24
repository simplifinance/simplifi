// import { NextApiRequest, NextApiResponse } from 'next';
// import { getUserIdentifier, SelfBackendVerifier, countryCodes } from '@selfxyz/core';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { proof, publicSignals } = req.body;

//       if (!proof || !publicSignals) {
//         return res.status(400).json({ message: 'Proof and publicSignals are required' });
//       }

//       // Extract user ID from the proof
//       const userId = await getUserIdentifier(publicSignals);
//       console.log("Extracted userId:", userId);

//       // Initialize and configure the verifier
//       const selfBackendVerifier = new SelfBackendVerifier(
//         'my-application-scope', 
//         'https://myapp.com/api/verify'
//       );

//       // Verify the proof
//       const result = await selfBackendVerifier.verify(proof, publicSignals);
      
//       if (result.isValid) {
//         // Return successful verification response
//         return res.status(200).json({
//           status: 'success',
//           result: true,
//           credentialSubject: result.credentialSubject
//         });
//       } else {
//         // Return failed verification response
//         return res.status(500).json({
//           status: 'error',
//           result: false,
//           message: 'Verification failed',
//           details: result.isValidDetails
//         });
//       }
//     } catch (error) {
//       console.error('Error verifying proof:', error);
//       return res.status(500).json({
//         status: 'error',
//         result: false,
//         message: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   } else {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }

// import SelfQRcodeWrapper, { SelfAppBuilder, SelfQRcode } from '@selfxyz/qrcode';
// import { v4 as uuidv4 } from 'uuid';
import {getUniversalLink, SelfAppBuilder } from '@selfxyz/core';
import { EndpointType } from '@selfxyz/core/dist/common/src/utils/appType';
import { Address } from '@/interfaces';

const APP_NAME = 'Simplifinance';
const SCOPE = "Simplifinance_verifier";
const ENDPOINT = "https://testnet.simplifinance.xyz";
const ENDPOINT_TYPE : EndpointType | undefined = "celo";


export function selfConfiguration(userId: Address, isMobileState: boolean) {
    // Create a SelfApp instance using the builder pattern
    const selfApp = new SelfAppBuilder({
      appName: APP_NAME,
      scope: SCOPE, 
      endpoint: ENDPOINT,
      endpointType: ENDPOINT_TYPE,
    //   logoBase64: "<base64EncodedLogo>", // Optional, accepts also PNG url
      userId,
    }).build();

    selfApp

    // Get deeplink from the Self app
    const deeplink = getUniversalLink(selfApp);

}
// Generate a unique user ID
// const userId = uuidv4();



// Render the QRcode component
// function MyComponent() {
//     return (
//       <SelfQRcodeWrapper
//         selfApp={selfApp}
//         onSuccess={() => {
//           console.log('Verification successful');
//           // Perform actions after successful verification
//         }}
//       />
//     );
//   }


// Complete example of how to implement self QRCode
// 'use client';

// import React, { useState, useEffect } from 'react';
// import SelfQRcodeWrapper, { SelfAppBuilder } from '@selfxyz/qrcode';
// import { v4 as uuidv4 } from 'uuid';

// function VerificationPage() {
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     // Generate a user ID when the component mounts
//     setUserId(uuidv4());
//   }, []);

//   if (!userId) return null;

//   // Create the SelfApp configuration
//   const selfApp = new SelfAppBuilder({
//     appName: "My Application",
//     scope: "my-application-scope",
//     endpoint: "https://myapp.com/api/verify",
//     userId,
//   }).build();

//   return (
//     <div className="verification-container">
//       <h1>Verify Your Identity</h1>
//       <p>Scan this QR code with the Self app to verify your identity</p>
      
//       <SelfQRcodeWrapper
//         selfApp={selfApp}
//         onSuccess={() => {
//           // Handle successful verification
//           console.log("Verification successful!");
//           // Redirect or update UI
//         }}
//         size={350}
//       />
      
//       <p className="text-sm text-gray-500">
//         User ID: {userId.substring(0, 8)}...
//       </p>
//     </div>
//   );
// }

// export default VerificationPage;


// Deeplink on mobile app redirects users to the Self app for verification 

// // instantiate the Self app using SelfBuilder
// const selfApp = new SelfAppBuilder({
//     appName: <your-app-name>,
//     scope: <your-app-scope>,
//     endpoint: <your-endpoint>,
//     logoBase64: <url-to-a-png>,
//     userIdType: 'hex', // only for if you want to link the proof with the user address
//     userId: <user-id>, // uuid or user address
// }).build();

