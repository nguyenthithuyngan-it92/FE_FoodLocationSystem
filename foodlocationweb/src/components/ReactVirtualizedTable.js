import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import EditIcon from "@mui/icons-material/Edit";
import RuleIcon from "@mui/icons-material/Rule";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Button, Tooltip } from "@mui/material";

import { numberWithCommas } from "../utils/converters";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";

export const ACTION_TYPES = {
  MINUS: "-",
  PLUS: "+",
};

export const ACTION_TYPES_V1 = {
  CHANGE_STATUS: "change_status",
  EDIT: "edit",
  DELETE: "delete",
};

//BEGIN CODE DEFAULT
const sample = [
  ["Frozen yoghurt", 159, 6.0, 24, 4.0],
  ["Ice cream sandwich", 237, 9.0, 37, 4.3],
  ["Eclair", 262, 16.0, 24, 6.0],
  ["Cupcake", 305, 3.7, 67, 4.3],
  ["Gingerbread", 356, 16.0, 49, 3.9],
];

function createData(id, dessert, calories, fat, carbs, protein) {
  return { id, dessert, calories, fat, carbs, protein };
}

const columnsDefault = [
  {
    width: 200,
    label: "Dessert",
    dataKey: "dessert",
  },
  {
    width: 120,
    label: "Calories\u00A0(g)",
    dataKey: "calories",
    numeric: true,
  },
  {
    width: 120,
    label: "Fat\u00A0(g)",
    dataKey: "fat",
    numeric: true,
  },
  {
    width: 120,
    label: "Carbs\u00A0(g)",
    dataKey: "carbs",
    numeric: true,
  },
  {
    width: 120,
    label: "Protein\u00A0(g)",
    dataKey: "protein",
    numeric: true,
  },
];

const rowsDefault = Array.from({ length: 1 }, (_, index) => {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  return createData(index, ...randomSelection);
});

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      aria-label="caption table"
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};
//END CODE DEFAULT

export default function ReactVirtualizedTable(props) {
  const { columns = columnsDefault, rows = rowsDefault } = props;
  const [loading, setLoading] = React.useState(false);

  // load header table (column)
  const fixedHeaderContent = () => {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align="center"
            style={{
              fontWeight: "bold",
              padding: 8,
              width: column.width,
              borderRight: "1px solid gray",
              whiteSpace: "nowrap",
            }}
            sx={{
              backgroundColor: "background.paper",
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // load data table
  const rowContent = (_index, row) => {
    const renderActive = (isActive) => {
      return isActive ? (
        <CheckCircleIcon style={{ color: "green", marginLeft: "35%" }} />
      ) : (
        <RemoveCircleIcon style={{ color: "red", marginLeft: "35%" }} />
      );
    };

    const renderByStatus = (status) => {
      if (status === 0)
        return (
          <PendingActionsIcon style={{ color: "red", marginRight: "35%" }} />
        );
      if (status === 1)
        return (
          <DeliveryDiningIcon color="warning" style={{ marginRight: "35%" }} />
        );

      return <CreditScoreIcon style={{ color: "green", marginRight: "35%" }} />;
    };

    const renderCellByDataKey = (column, dataKey) => {
      if (column.numeric && dataKey !== "order_status") {
        return numberWithCommas(row[column.dataKey]);
      }
      // SET TABLE ORDER CART
      if (dataKey === "quantity" && column.hasAction) {
        return (
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              style={{ minWidth: 50, color: "red" }}
              onClick={() => {
                if (typeof column.service === "function") {
                  column.service(ACTION_TYPES.MINUS, row);
                }
              }}
            >
              <IndeterminateCheckBoxIcon />
            </Button>
            <span>{row[column.dataKey]}</span>
            <Button
              size="small"
              style={{ minWidth: 50, color: "green" }}
              onClick={() => {
                if (typeof column.service === "function") {
                  column.service(ACTION_TYPES.PLUS, row);
                }
              }}
            >
              <AddBoxIcon />
            </Button>
          </div>
        );
      }
      // SET ICON - BUTTON MANAGEMENT
      switch (dataKey) {
        case "active":
        case "payment_status":
          return renderActive(row[dataKey]);
        case "order_status":
          return renderByStatus(row[dataKey]);
        case "action_v1":
          const disabled =
            row &&
            Object.prototype.hasOwnProperty.call(row, "food_count") &&
            Number(row.food_count) !== 0;

          return (
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Tooltip title="Chuyển trạng thái">
                <Button
                  size="small"
                  variant="outlined"
                  style={{ minWidth: 50, color: "blue", borderColor: "blue" }}
                  onClick={() => {
                    if (typeof column.service === "function") {
                      column.service(ACTION_TYPES_V1.CHANGE_STATUS, row);
                    }
                  }}
                >
                  <RuleIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Chỉnh sửa">
                <Button
                  size="small"
                  variant="outlined"
                  style={{
                    minWidth: 50,
                    color: "orange",
                    borderColor: "orange",
                  }}
                  onClick={() => {
                    if (typeof column.service === "function") {
                      column.service(ACTION_TYPES_V1.EDIT, row);
                    }
                  }}
                >
                  <EditIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Xóa">
                <Button
                  size="small"
                  variant="outlined"
                  disabled={disabled}
                  style={{
                    minWidth: 50,
                    color: "red",
                    borderColor: "red",
                    opacity: disabled ? 0.3 : 1,
                  }}
                  onClick={() => {
                    if (typeof column.service === "function") {
                      column.service(ACTION_TYPES_V1.DELETE, row);
                    }
                  }}
                >
                  <DeleteOutlineIcon />
                </Button>
              </Tooltip>
            </div>
          );
        case "action_v2":
          return (
            <Tooltip title="Xác nhận đơn hàng">
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                variant="outlined"
                onClick={() => {
                  if (typeof column.service === "function") {
                    column.service(row);
                  }
                }}
              >
                Xác nhận
              </LoadingButton>
            </Tooltip>
          );
        default:
          return row[column.dataKey];
      }
    };

    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.numeric || false ? "right" : "left"}
            style={{
              padding: 8,
              width: column.width,
              borderRight: "1px solid gray",
            }}
          >
            {renderCellByDataKey(column, column.dataKey)}
          </TableCell>
        ))}
      </React.Fragment>
    );
  };

  return (
    <Paper style={{ height: 400, width: "100%" }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
