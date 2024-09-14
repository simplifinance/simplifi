// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import { Box, Toolbar, Typography, Menu, Container, Button, MenuItem, IconButton } from "@mui/material";
// import MenuIcon from "@mui/material/Menu";
// import ConnectButton from "../ConnectButton";
// import Connect from "../Connect";
// import Chains from "../Chains/Chains";
// import FetchTokenBalance from "../FetchTokenBalance";
// import Link from 'next/link';
// import { Switcher } from "./Switcher";
// import { useCelo } from "@celo/react-celo";

// interface NavBarProps {
//   toggleMode: () => void;
// }

// function Navbar(props: NavBarProps) {
//   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
//   const { address, initialised } = useCelo();

//   const { toggleMode } = props;

//   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElNav(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   return (
//     <AppBar position="static" sx={{ background: "none" }} elevation={0}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>
//             <Link href="/" passHref>
//               <img src="/images/logo.png" alt="company logo" className="logo" width={180} height={50} />
//             </Link>
//           </Typography>

//           <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
//             <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
//               <MenuIcon className="text-orange-500" open={false} />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               anchorOrigin={{
//                 vertical: "top",
//                 horizontal: "left"
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "left"
//               }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{
//                 display: { xs: "block", md: "none" }
//               }}
//             > 
//               <MenuItem ><Switcher toggleMode={toggleMode} /></MenuItem>
//               <MenuItem ><FetchTokenBalance /></MenuItem>
//               <Box>
//                 <MenuItem >Home</MenuItem>
//                 <MenuItem >Finance</MenuItem>
//                 <MenuItem >Invest</MenuItem>
//                 <MenuItem >Governance</MenuItem>
//                 <MenuItem >
//                   <Link href="https://github.com/Quatre-Finance/Q-paper" title="Documentation" passHref>
//                     Documentation
//                   </Link>
//                 </MenuItem>
//               </Box>
//             </Menu>
//           </Box>

//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
//             <Link href="/" passHref>
//               <img src="/images/logo.png" alt="company logo" className="logo" width={180} height={50} />
//             </Link>
//           </Typography>

//           <Box>
//             <MenuItem >Home</MenuItem>
//             <MenuItem >Finance</MenuItem>
//             <MenuItem >Invest</MenuItem>
//             <MenuItem >Governance</MenuItem>
//             <MenuItem >
//               <Link href="https://github.com/Quatre-Finance/Q-paper" title="Documentation" passHref>
//                 Documentation
//               </Link>
//             </MenuItem>
//           </Box>

//           <Box sx={{ flexGrow: 0, display: "flex" }} className="ml-6">
//             {/* <Chains /> */}
//             {/* {address && <Connect />} */}
//             {/* {!address && <ConnectButton />} */}
//           </Box>
//           <Switcher toggleMode={toggleMode}/>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }
// export default Navbar;

