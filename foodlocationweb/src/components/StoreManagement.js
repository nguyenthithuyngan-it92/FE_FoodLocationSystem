import { useState, useContext, useEffect, useMemo } from "react";
import API, { authAPI, endpoints } from "../configs/API";
import { UserContext } from "../configs/MyContext";
import Loading from "../layout/Loading";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import InfoStore from "../layout/InfoStore";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import FuncStore, { MAP_INDEX_MENU } from "./FuncStore";
import ReactVirtualizedTable from "./ReactVirtualizedTable";
import InputFormUser from "../layout/InputFormUser";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormLabel } from "react-bootstrap";

import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
];

const columnsMenu = [
  { width: 50, label: "Mã", dataKey: "id", numeric: true },
  { width: 120, label: "Tên danh mục", dataKey: "name", numeric: false },
  {
    width: 120,
    label: "Số lượng món ăn",
    dataKey: "food_count",
    numeric: true,
  },
  { width: 120, label: "Trạng thái", dataKey: "active", numeric: false },
  {
    width: 150,
    label: "Hành động",
    dataKey: "action_v1",
    numeric: false,
    service: () => console.log("hihi"),
  },
];

const columnsFood = [
  { width: 50, label: "Mã", dataKey: "id", numeric: true },
  { width: 200, label: "Tên món ăn", dataKey: "name", numeric: false },
  { width: 120, label: "Giá", dataKey: "price", numeric: true },
  {
    width: 120,
    label: "Danh mục",
    dataKey: "menu_name",
    numeric: true,
  },
  { width: 80, label: "Trạng thái", dataKey: "active", numeric: false },
  { width: 120, label: "TG bán", dataKey: "start_time", numeric: false },
  { width: 120, label: "TG nghỉ", dataKey: "end_time", numeric: false },
  { width: 220, label: "Mô tả", dataKey: "description", numeric: false },
  {
    width: 150,
    label: "Hành động",
    dataKey: "action_v1",
    numeric: false,
    service: () => console.log("hihi"),
  },
];

const columnsOrder = [
  { width: 50, label: "Mã", dataKey: "id", numeric: true },
  {
    width: 100,
    label: "TT đơn hàng",
    dataKey: "order_status",
    numeric: true,
  },
  {
    width: 150,
    label: "Tài khoản đặt hàng",
    dataKey: "user",
    numeric: false,
  },
  {
    width: 150,
    label: "Tên người nhận",
    dataKey: "receiver_name",
    numeric: false,
  },
  {
    width: 200,
    label: "Địa chỉ nhận",
    dataKey: "receiver_address",
    numeric: false,
  },
  { width: 100, label: "SĐT nhận", dataKey: "receiver_phone", numeric: false },
  { width: 100, label: "Tổng tiền", dataKey: "amount", numeric: true },
  {
    width: 130,
    label: "Phí giao hàng",
    dataKey: "delivery_fee",
    numeric: true,
  },
  { width: 150, label: "Ngày tạo", dataKey: "created_date", numeric: false },
  {
    width: 110,
    label: "TT thanh toán",
    dataKey: "payment_status",
    numeric: false,
  },
  {
    width: 200,
    label: "Ngày thanh toán",
    dataKey: "payment_date",
    numeric: false,
  },
  {
    width: 150,
    label: "Hành động",
    dataKey: "action_v2",
    numeric: false,
    service: () => console.log("hihi"),
  },
];

const StoreManagement = () => {
  const [user] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(MAP_INDEX_MENU.MENU);
  const [age, setAge] = useState("");
  const [menu, setMenu] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagsValue, setTagsValue] = useState([]);

  useEffect(() => {
    try {
      const fetchListMenu = async () => {
        const res = await API.get(endpoints["menu-store"](user.id));
        if (res.status === 200) {
          setMenu(res.data);
        }
      };

      fetchListMenu();
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    const loadTags = async () => {
      let res = await API.get(endpoints["tags"]);
      setTags(res.data.results);
    };

    loadTags();
  }, []);

  console.log({ tagsValue });

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleListItemClick = (type) => {
    setSelectedMenuItem(type);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // load store
  useEffect(() => {
    let loadData = async () => {
      try {
        let res = [];
        switch (selectedMenuItem) {
          case MAP_INDEX_MENU.FOOD:
            const temp = await authAPI().get(endpoints["food-management"]);
            res = {
              data: temp.data.map((item) => {
                const { menu_item = {}, ...restInfo } = item;
                console.log({ menu_item });
                return {
                  ...restInfo,
                  menu_name: menu_item.name || "",
                };
              }),
            };
            break;
          case MAP_INDEX_MENU.NOT_ACCEPTED:
          case MAP_INDEX_MENU.DELIVERING:
          case MAP_INDEX_MENU.ORDER:
            let url = "order-store";
            if (selectedMenuItem === MAP_INDEX_MENU.NOT_ACCEPTED) {
              url = "order-pending";
            }
            if (selectedMenuItem === MAP_INDEX_MENU.DELIVERING) {
              url = "order-accepted";
            }

            res = await authAPI().get(endpoints[url]);
            break;
          default:
            res = await authAPI().get(endpoints["menu-management"]);
            break;
        }

        setDataTable(res.data);
      } catch (ex) {}
    };

    loadData();
  }, [selectedMenuItem]);

  const renderForm = (type) => {
    if (type === MAP_INDEX_MENU.MENU)
      return (
        <InputFormUser
          label="Tên danh mục"
          type="text"
          value=""
          controlId="name"
          setValue=""
        />
      );

    return (
      <>
        <InputFormUser
          label="Tên món ăn"
          type="text"
          value=""
          controlId="name"
          setValue=""
        />
        <InputFormUser
          label="Giá bán"
          type="text"
          value=""
          controlId="price"
          setValue=""
        />
        <FormControl fullWidth>
          <FormLabel>Tên danh mục</FormLabel>
          <Select
            value={age}
            onChange={handleChange}
            displayEmpty
            style={{ height: 37 }}
          >
            {menu.map((menuItem) => (
              <MenuItem value={menuItem.id}>{menuItem.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <InputFormUser type="file" label="Ảnh món ăn" />
        <InputFormUser
          label="Thời gian bắt đầu bán"
          type="time"
          value=""
          controlId="st"
          setValue=""
        />
        <InputFormUser
          label="Thời gian kết thúc bán"
          type="time"
          value=""
          controlId="et"
          setValue=""
        />
        <FormControl fullWidth>
          <FormLabel>Mô tả</FormLabel>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={4}
            defaultValue=""
            placeholder="Mô tả"
          />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel>Nhãn</FormLabel>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={tags}
            value={tagsValue}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            style={{ width: 535 }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Nhãn" />
            )}
            onChange={(e, value) => {
              setTagsValue(value);
              console.log("value :>", value);
            }}
          />
        </FormControl>
      </>
    );
  };

  const columns = useMemo(() => {
    switch (selectedMenuItem) {
      case MAP_INDEX_MENU.FOOD:
        return columnsFood;
      case MAP_INDEX_MENU.DELIVERING:
      case MAP_INDEX_MENU.NOT_ACCEPTED:
      case MAP_INDEX_MENU.ORDER:
        if (selectedMenuItem === MAP_INDEX_MENU.ORDER) {
          return columnsOrder.filter((item) => item.dataKey !== "action_v2");
        }

        return columnsOrder;
      default:
        return columnsMenu;
    }
  }, [selectedMenuItem]);

  if (user === null)
    return (
      <Alert severity="warning" sx={{ margin: "10px" }}>
        Vui lòng <Link to="/login"> đăng nhập </Link>vào tài khoản cửa hàng của
        bạn!
      </Alert>
    );
  if (user.user_role !== 1)
    return (
      <Alert severity="warning">
        Tài khoản của bạn không có quyền truy cập!
      </Alert>
    );

  // if (stores === null) return <Loading />

  return (
    <>
      {/* <h1 className="text-center text-success m-3">QUẢN LÝ CỬA HÀNG</h1> */}
      {user.is_verify === 0 ? (
        <Alert severity="warning">
          Tài khoản của bạn chưa được chứng thực để thực hiện chức năng này!
        </Alert>
      ) : (
        <div>
          {/* INFO STORE */} <InfoStore />
          <div style={{ display: "flex", gap: "15px" }}>
            {/* DANH SÁCH CHỨC NĂNG */}
            <FuncStore
              selectedMenuItem={selectedMenuItem}
              onClickListItem={handleListItemClick}
            />
            <div style={{ marginRight: 10, flex: 1 }}>
              <Button
                size="small"
                variant="outlined"
                style={{
                  display: "block",
                  minWidth: 50,
                  color: "green",
                  borderColor: "green",
                  margin: "10px 0 10px auto",
                }}
                onClick={handleClickOpen}
              >
                <AddIcon />
                <span style={{ fontSize: "16px" }}>Tạo mới</span>
              </Button>
              <ReactVirtualizedTable columns={columns} rows={dataTable} />
            </div>
          </div>
        </div>
      )}

      {/* DIALOG ADD */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>TẠO MỚI</DialogTitle>
        <DialogContent>{renderForm(selectedMenuItem)}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: "red" }}>
            Hủy
          </Button>
          <Button onClick={handleClose} style={{ color: "green" }}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreManagement;
