// import * as React from 'react';
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import { SetStateAction, useEffect, useState } from "react";
// // import { Menu, MenuItem } from "@mui/material";
// import { Network, useCelo } from "@celo/react-celo";

// interface ChainsProps {
//   setPageRef: Function;
//   setmessage: Function;
// }

// function Chains(props: ChainsProps) {
//   const { updateNetwork, networks, network } = useCelo();
//   const { setPageRef, setmessage } = props;
//   const [currentNetwork, setCurrentNetork] = useState(network);

//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleMenuClick = async (e: { preventDefault: () => void; key: string | number }) => {
//     e.preventDefault();
//     let networkChoice: SetStateAction<Network>;
//     if (!currentNetwork) return null;
//     await updateNetwork(network).then(() => {
//       networkChoice = networks[Number(e.key)];
//       setCurrentNetork(networkChoice);
//     });
//   };


//   return (
//     <div>
//       <Button
//         id="demo-positioned-button"
//         aria-controls={open ? 'demo-positioned-menu' : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? 'true' : undefined}
//         onClick={handleClick}
//       >
//         {currentNetwork.chainId === network.chainId ? currentNetwork.name : "SelectNetwork"}
//       </Button>
//       <Menu
//         id="demo-positioned-menu"
//         aria-labelledby="demo-positioned-button"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'left',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'left',
//         }}
//       >
//         {
//           networks.map((items, key) => (
//             <MenuItem onClick={handleClose} key={key}>{items.name}</MenuItem>
//         ))}
//       </Menu>
//     </div>
//   );
// }

// export default Chains;
