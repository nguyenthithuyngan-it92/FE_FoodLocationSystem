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
import { useState } from "react"

const FuncStore = () => {
    const [openO, setOpenO] = useState(false);
    const [openS, setOpenS] = useState(false);

    const handleClickOrder = () => {
        setOpenO(!openO);
    };

    const handleClickStats = () => {
        setOpenS(!openS);
    };

    return (
        <>
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

export default FuncStore