import { useState, useContext, useEffect } from "react"
import API, { authAPI, endpoints } from "../configs/API"
import { UserContext } from "../configs/MyContext"
import Loading from "../layout/Loading"

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import BarChartIcon from '@mui/icons-material/BarChart';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AddAlertIcon from '@mui/icons-material/AddAlert';

const StoreManagement = () => {
    const [user, ] = useContext(UserContext)
    const [stores, setStores] = useState([])

    const [openO, setOpenO] = useState(false);
    const [openS, setOpenS] = useState(false);

    const handleClickOrder = () => {
        setOpenO(!openO);
    };

    const handleClickStats = () => {
        setOpenS(!openS);
    };

    // load store
    useEffect(() => {
        let loadStore = async () => {
            try {
                let res = await authAPI().get(endpoints['store-management'])
                setStores(res.data)
                console.log(res.data)
            } catch (ex) {
                
            }
        }

        loadStore()
        
    }, [])

    if (stores === null) return <Loading />

    return (
        <>
            {/* <h1 className="text-center text-success m-3">QUẢN LÝ CỬA HÀNG</h1> */}

            {/* INFO STORE */}
            <Card sx={{ display: 'flex',  margin:'10px'}}>
                <CardMedia
                    component="img" 
                    sx={{ width: 160, height:160, objectFit:'cover', margin: '25px'}}
                    src={user.image} alt={user.username}/>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h4" sx={{ flex: '1 0 auto' }}>
                            {user.name_store}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ margin: '10px 0' }}>
                            <LocationOnIcon />  {user.address}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div" sx={{ margin: '10px 0' }}>
                            <LocalPhoneIcon />  {user.phone}
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                    <IconButton aria-label="subcribes">
                            <AddAlertIcon sx={{ height: 20, width: 20 }} />
                        </IconButton>
                        <Typography component="div" variant="h8" color="text.secondary">
                            0 người theo dõi
                        </Typography>
                    
                    </Box>
                </Box>
            </Card>

            {/* DANH SÁCH CHỨC NĂNG */}
            <List sx={{ width: '50%', maxWidth: 260, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    Danh sách chức năng
                    </ListSubheader>
                }
                >
                <ListItemButton>
                    <ListItemIcon>
                    <MenuBookIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lý menu" />
                </ListItemButton>
                <Divider component="li" />
                <li>
                    <Typography sx={{ mt: 0.5, ml: 2 }} color="text.secondary" display="block" variant="caption"></Typography>
                </li>
                <ListItemButton>
                    <ListItemIcon>
                    <RestaurantIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lý món ăn" />
                </ListItemButton>
                <Divider component="li" />
                <li>
                    <Typography sx={{ mt: 0.5, ml: 2 }} color="text.secondary" display="block" variant="caption"></Typography>
                </li>
                
                <ListItemButton onClick={handleClickOrder}>
                    <ListItemIcon>
                    <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lý đơn hàng" />
                    {openO ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openO} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <PendingActionsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Đơn chưa xác nhận" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <DeliveryDiningIcon />
                            </ListItemIcon>
                            <ListItemText primary="Đơn đang giao" />
                        </ListItemButton>
                    </List>
                </Collapse>

                <Divider component="li" />
                <li>
                    <Typography sx={{ mt: 0.5, ml: 2 }} color="text.secondary" display="block" variant="caption"></Typography>
                </li>

                <ListItemButton onClick={handleClickStats}>
                    <ListItemIcon>
                    <QueryStatsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Thống kê" />
                    {openS ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openS} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Doanh thu món ăn" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                            <DonutSmallIcon />
                            </ListItemIcon>
                            <ListItemText primary="Danh mục món ăn" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
            

        </>
        
    )

}

export default StoreManagement