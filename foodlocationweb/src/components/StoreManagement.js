import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import API, { authAPI, endpoints } from "../configs/API";
import { UserContext } from "../configs/MyContext";
import { Button, DialogContentText, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import InfoStore from "../layout/InfoStore";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import FuncStore, { MAP_INDEX_MENU } from "./FuncStore";
import ReactVirtualizedTable, {
  ACTION_TYPES_V1,
} from "./ReactVirtualizedTable";
import InputFormUser from "../layout/InputFormUser";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormLabel } from "react-bootstrap";

import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// const top100Films = [
//   { title: "The Shawshank Redemption", year: 1994 },
//   { title: "The Godfather", year: 1972 },
//   { title: "The Godfather: Part II", year: 1974 },
// ];

const StoreManagement = () => {
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
      width: 180,
      label: "Hành động",
      dataKey: "action_v1",
      numeric: false,
      service: (type, data) => handleActionMenu(type, data),
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
    { width: 120, label: "TG bán", dataKey: "start_time", numeric: false },
    { width: 120, label: "TG nghỉ", dataKey: "end_time", numeric: false },
    { width: 80, label: "Trạng thái", dataKey: "active", numeric: false },
    { width: 220, label: "Mô tả", dataKey: "description", numeric: false },
    {
      width: 180,
      label: "Hành động",
      dataKey: "action_v1",
      numeric: false,
      service: (type, data) => handleActionFood(type, data),
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
    {
      width: 100,
      label: "SĐT nhận",
      dataKey: "receiver_phone",
      numeric: false,
    },
    { width: 100, label: "Tổng tiền", dataKey: "amount", numeric: true },
    {
      width: 130,
      label: "Phí giao hàng",
      dataKey: "delivery_fee",
      numeric: true,
    },
    { width: 150, label: "Ngày tạo", dataKey: "created_date", numeric: false },
    {
      width: 130,
      label: "Phương thức TT",
      dataKey: "paymentmethod_name",
      numeric: true,
    },
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
      service: (data) => handleClickOpenConfirm(data.id),
    },
  ];

  const [user] = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [isEditData, setIsEditData] = useState(false);
  const [cacheId, setCacheId] = useState(null);
  const [cacheEditId, setCacheEditId] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(MAP_INDEX_MENU.MENU);
  const [menu, setMenu] = useState([]);
  const [refresher, setRefresher] = useState(1);

  const [tags, setTags] = useState([]);
  const [tagsValue, setTagsValue] = useState([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [mess, setMess] = useState(null);

  const [formMenu, setFormMenu] = useState({
    name: "",
  });
  const [formFood, setFormFood] = useState({
    name: "",
    price: "",
    description: "",
    start_time: "",
    end_time: "",
    menu_item: "",
    tags: "",
  });
  const image_food = useRef();
  const navigate = useNavigate();

  // event click
  const handleListItemClick = (type) => {
    setSelectedMenuItem(type);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenConfirm = (id) => {
    setCacheId(id);
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const [openMess, setOpenMess] = useState(false);

  const handleCloseMess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenMess(false);
  };

  const fetchListMenu = async () => {
    try {
      const res = await API.get(endpoints["menu-store"](user.id));
      if (res.status === 200) {
        setMenu(res.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchListMenu();
  }, [user, refresher]);

  useEffect(() => {
    const loadTags = async () => {
      let res = await API.get(endpoints["tags"]);
      setTags(res.data.results);
    };

    loadTags();
  }, []);

  //LOAD DATA TABLE BY SELECTEDITEM
  useEffect(() => {
    let loadData = async () => {
      // console.log("trigger refresher");
      try {
        let res = [];
        switch (selectedMenuItem) {
          case MAP_INDEX_MENU.FOOD:
            const temp = await authAPI().get(endpoints["food-management"]);
            res = {
              data: temp.data.map((item) => {
                const { menu_item = {}, ...restInfo } = item;
                // console.log({ menu_item });
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

            let tempO = await authAPI().get(endpoints[url]);
            console.log(tempO.data);
            res = {
              data: tempO.data.map((i) => {
                const { paymentmethod = {}, ...restInfo } = i;
                // console.log(paymentmethod);
                return {
                  ...restInfo,
                  paymentmethod_name:
                    Number(paymentmethod) === 2 ? "MoMo" : "Tiền mặt",
                };
              }),
            };
            break;
          default:
            res = await authAPI().get(endpoints["menu-management"]);
            break;
        }

        setDataTable(res.data);
      } catch (ex) {}
    };

    loadData();
  }, [selectedMenuItem, refresher]);

  // LOAD FORM DIALOG (MENU, FOOD)
  const renderForm = (type) => {
    if (type === MAP_INDEX_MENU.MENU) {
      return (
        <InputFormUser
          label="Tên danh mục"
          type="text"
          value={formMenu.name}
          controlId="name"
          setValue={(e) => {
            setFormMenu({
              ...formMenu,
              name: e.target.value,
            });
          }}
        />
      );
    }

    return (
      <>
        {err ? <Alert severity="error">{err}</Alert> : ""}
        <InputFormUser
          label="Tên món ăn"
          type="text"
          value={formFood.name}
          controlId="name"
          setValue={(e) => {
            setFormFood({
              ...formFood,
              name: e.target.value,
            });
          }}
        />
        <InputFormUser
          label="Giá bán"
          type="number"
          value={formFood.price}
          controlId="price"
          setValue={(e) => {
            setFormFood({
              ...formFood,
              price: e.target.value,
            });
          }}
        />
        <FormControl fullWidth>
          <FormLabel>Danh mục</FormLabel>
          <Select
            onChange={(e) => {
              setFormFood({
                ...formFood,
                menu_item: e.target.value,
              });
            }}
            value={formFood.menu_item}
            displayEmpty
            style={{ height: 37 }}
          >
            {menu.map((menuItem) => (
              <MenuItem value={menuItem.id}>{menuItem.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <InputFormUser type="file" ref={image_food} label="Ảnh món ăn" />
        <InputFormUser
          label="Thời gian bắt đầu bán"
          type="time"
          value={formFood.start_time}
          controlId="st"
          setValue={(e) => {
            setFormFood({
              ...formFood,
              start_time: e.target.value,
            });
          }}
        />
        <InputFormUser
          label="Thời gian kết thúc bán"
          type="time"
          value={formFood.end_time}
          controlId="et"
          setValue={(e) => {
            setFormFood({
              ...formFood,
              end_time: e.target.value,
            });
          }}
        />
        <FormControl fullWidth>
          <FormLabel>Mô tả</FormLabel>
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={4}
            value={formFood.description}
            placeholder="Mô tả"
            onChange={(e) => {
              setFormFood({
                ...formFood,
                description: e.target.value,
              });
            }}
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
            }}
          />
        </FormControl>
      </>
    );
  };

  // addMenu
  const addMenu = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {
        ...formMenu,
        store: user.id,
      };

      let res = await authAPI().post(endpoints["menu-items"], params);
      console.info(res);

      if (res.status === 201) {
        setRefresher((pre) => pre + 1);
        setFormMenu({
          name: "",
        });
        setOpen(false);
        setMess(res.data.message);
        setOpenMess(true);
        navigate("/store-management");
      } else setErr("Hệ thống bị lỗi! Vui lòng quay lại sau");
    } catch (ex) {
      let e = "";
      for (let d of Object.values(ex.response.data)) e += `${d} <br />`;

      setErr(e);
    } finally {
      setLoading(false);
    }
  };

  // EDIT MENU
  const editMenu = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {
        ...formMenu,
      };

      let res = await authAPI().put(
        endpoints["action-menu"](cacheEditId),
        params
      );
      console.info(res);

      if (res.status === 200) {
        setRefresher((pre) => pre + 1);
        setFormMenu({
          name: "",
        });
        setCacheEditId(null);
        setIsEditData(false);
        setOpen(false);
        setMess(res.data.message);
        setOpenMess(true);
        navigate("/store-management");
      } else setErr("Hệ thống bị lỗi! Vui lòng quay lại sau");
    } catch (ex) {
      let e = "";
      for (let d of Object.values(ex.response.data)) e += `${d} <br />`;

      setErr(e);
    } finally {
      setLoading(false);
    }
  };

  // addFood
  const addFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    let isValid = true;

    if (formFood.name === "") {
      setErr("Phải nhập tên món ăn!");
      isValid = false;
    } else if (formFood.price === "") {
      setErr("Phải nhập giá bán!");
      isValid = false;
    } else if (formFood.menu_item === "") {
      setErr("Phải chọn danh mục món ăn!");
      isValid = false;
    } else if (image_food.current.files.length === 0) {
      setErr("Phải chọn ảnh món ăn!");
      isValid = false;
    } else if (formFood.start_time === "" || formFood.end_time === "") {
      setErr("Phải chọn thời gian bán!");
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      let form = new FormData();
      form.append("name", formFood.name);
      form.append("price", formFood.price);
      form.append("description", formFood.description);
      form.append("start_time", formFood.start_time);
      form.append("end_time", formFood.end_time);
      form.append("menu_item", formFood.menu_item);

      const newTags = tagsValue.map((tag) => ({ id: tag.id }));
      form.append("tags", JSON.stringify(newTags));

      if (image_food.current.files.length > 0) {
        form.append("image_food", image_food.current.files[0]);
        let res = await authAPI().post(endpoints["food-store"], form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.status === 201) {
          setFormFood({
            name: "",
            price: "",
            description: "",
            start_time: "",
            end_time: "",
            menu_item: "",
            image: "",
          });
          setTagsValue([]);
          setRefresher((pre) => pre + 1);
          setOpen(false);
          setOpenMess(true);
          setMess(res.data.message);
          navigate("/store-management");
        } else setErr("Hệ thống bị lỗi! Vui lòng quay lại sau");
      }
    } catch (ex) {
      let e = "";
      for (let d of Object.values(ex.response.data)) e += `${d} <br />`;

      setErr(e);
    } finally {
      setLoading(false);
    }
  };

  // EDIT FOOD
  const editFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let form = new FormData();
      form.append("name", formFood.name);
      form.append("price", formFood.price);
      form.append("description", formFood.description);
      form.append("start_time", formFood.start_time);
      form.append("end_time", formFood.end_time);
      form.append("menu_item", formFood.menu_item);

      const newTags = tagsValue.map((tag) => ({ id: tag.id }));
      form.append("tags", JSON.stringify(newTags));

      if (image_food.current.files.length > 0)
        form.append("image_food", image_food.current.files[0]);

      let res = await authAPI().put(
        endpoints["action-food"](cacheEditId),
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setFormFood({
          name: "",
          price: "",
          description: "",
          start_time: "",
          end_time: "",
          menu_item: "",
          image: "",
        });
        setCacheEditId(null);
        setIsEditData(false);
        setTagsValue([]);
        setRefresher((pre) => pre + 1);
        setOpen(false);
        setOpenMess(true);
        setMess(res.data.message);
        navigate("/store-management");
      } else setErr("Hệ thống bị lỗi! Vui lòng quay lại sau");
    } catch (ex) {
      let e = "";
      for (let d of Object.values(ex.response.data)) e += `${d} <br />`;

      setErr(e);
    } finally {
      setLoading(false);
    }
  };

  // LOAD BUTTON FORM DIALOG
  const renderButtonAdd = (type, isEdit) => {
    if (isEdit) {
      return (
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
          onClick={type === MAP_INDEX_MENU.MENU ? editMenu : editFood}
        >
          {type === MAP_INDEX_MENU.MENU ? "Chỉnh sửa menu" : "Chỉnh sửa món ăn"}
        </LoadingButton>
      );
    }

    if (type === MAP_INDEX_MENU.MENU) {
      return (
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
          onClick={addMenu}
        >
          Thêm menu
        </LoadingButton>
      );
    } else {
      return (
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
          onClick={addFood}
          style={{ marginRight: 25 }}
        >
          Thêm món ăn
        </LoadingButton>
      );
    }
  };

  // ACTION DIALOG CONFIRM (DELETE, CHANGE_STATUS)
  const handleActionConfirm = async () => {
    try {
      let res;
      if (
        [MAP_INDEX_MENU.FOOD, MAP_INDEX_MENU.MENU].includes(selectedMenuItem)
      ) {
        const url =
          MAP_INDEX_MENU.FOOD === selectedMenuItem
            ? "action-food"
            : "action-menu";
        res = await authAPI().delete(endpoints[url](cacheId));
      }

      if (
        [MAP_INDEX_MENU.NOT_ACCEPTED, MAP_INDEX_MENU.DELIVERING].includes(
          selectedMenuItem
        )
      ) {
        res = await authAPI().post(endpoints["confirm-order"](cacheId));
      }

      if (res && res.status === 200) {
        setMess(res.data.message);
        setCacheId(null);
        setOpenMess(true);
        setRefresher((pre) => pre + 1);
      }
      setOpenConfirm(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ACTION MENU (EDIT, DELETE, CHANGE_STATUS)
  const handleActionMenu = async (type, data) => {
    try {
      let res;
      if (type === ACTION_TYPES_V1.CHANGE_STATUS) {
        res = await authAPI().post(endpoints["status-menu"](data.id));
      }
      if (type === ACTION_TYPES_V1.DELETE) {
        handleClickOpenConfirm(data.id);
        return;
      }
      if (type === ACTION_TYPES_V1.EDIT) {
        setIsEditData(true);
        setFormMenu({
          ...formMenu,
          name: data.name,
        });
        setCacheEditId(data.id);
        setOpen(true);
        return;
      }

      if (res && res.status === 200) {
        setMess(res.data.message);
        setOpenMess(true);
        setRefresher((pre) => pre + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ACTION FOOD (EDIT, DELETE, CHANGE_STATUS)
  const handleActionFood = async (type, data) => {
    try {
      let res;
      if (type === ACTION_TYPES_V1.CHANGE_STATUS) {
        res = await authAPI().post(endpoints["status-food"](data.id));
      }
      if (type === ACTION_TYPES_V1.DELETE) {
        handleClickOpenConfirm(data.id);
        return;
      }
      if (type === ACTION_TYPES_V1.EDIT) {
        // console.log("data clicked :>", data);
        let currentMenu;
        if (menu) {
          currentMenu = menu.find(
            (menuItem) => menuItem.name === data.menu_name
          );
        }

        setCacheEditId(data.id);
        setFormFood({
          ...formFood,
          name: data.name,
          description: data.description,
          price: data.price,
          start_time: data.start_time,
          end_time: data.end_time,
          menu_item: currentMenu ? currentMenu.id : null,
        });
        setTagsValue(data.tags);
        setIsEditData(true);
        setOpen(true);
        return;
      }

      if (res && res.status === 200) {
        setMess(res.data.message);
        setOpenMess(true);
        setRefresher((pre) => pre + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // check columns theo selectedMenuItem
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

  // check user login
  if (user === null)
    return (
      <Alert severity="warning" sx={{ margin: "10px" }}>
        Vui lòng <Link to="/login"> đăng nhập </Link>vào tài khoản cửa hàng của
        bạn!
      </Alert>
    );
  else if (user.user_role !== 1)
    return (
      <Alert severity="warning" style={{ margin: 5 }}>
        Tài khoản của bạn không có quyền truy cập!
      </Alert>
    );

  // =====CODE UI====
  return (
    <>
      <div>
        {/* INFO STORE */} <InfoStore />
        {/* CHỨC NĂNG QUẢN LÝ */}
        {Number(user.is_verify) === 1 ? (
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

              {/* TABLE */}
              <ReactVirtualizedTable columns={columns} rows={dataTable} />
            </div>
          </div>
        ) : (
          <Alert severity="warning">
            Tài khoản của bạn chưa được chứng thực để thực hiện chức năng quản
            lý!
          </Alert>
        )}
      </div>

      {/* MESSAGE */}
      <Snackbar
        open={openMess}
        autoHideDuration={6000}
        onClose={handleCloseMess}
      >
        <Alert onClose={handleCloseMess}>{mess}</Alert>
      </Snackbar>

      {/* DIALOG ADD */}
      <Dialog open={open} onClose={handleClose} style={{ minWidth: "400px" }}>
        <DialogTitle
          style={{
            color: "Highlight",
            fontSize: 20,
            fontWeight: "bold",
            padding: "10px 20px",
            minWidth: "400px",
          }}
        >
          {isEditData ? "Chỉnh sửa thông tin" : "TẠO MỚI"}
        </DialogTitle>
        <Divider color="gray" />
        <DialogContent style={{ minWidth: "400px" }}>
          {renderForm(selectedMenuItem, isEditData)}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            style={{ color: "red", borderColor: "red" }}
          >
            Hủy
          </Button>
          {renderButtonAdd(selectedMenuItem, isEditData)}
        </DialogActions>
      </Dialog>
      {/* DIALOG THÔNG BÁO SET STATUS _ DELETE */}
      <Dialog
        open={openConfirm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseConfirm}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ color: "red", fontWeight: "bold" }}>
          Cảnh báo
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-dFescription">
            Bạn có chắc chắn muốn thực hiện hành động này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            style={{ color: "red", border: "1px solid red" }}
            onClick={handleCloseConfirm}
          >
            Hủy
          </Button>
          <Button
            style={{ color: "green", border: "1px solid green" }}
            onClick={() => handleActionConfirm()}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreManagement;
