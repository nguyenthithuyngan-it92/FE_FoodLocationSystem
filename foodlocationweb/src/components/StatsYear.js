import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { authAPI, endpoints } from "../configs/API";

function RevenueStatsYear() {
  const [year, setYear] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [items, setItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [error, setError] = useState("");

  // Gọi API để lấy dữ liệu thống kê doanh thu
  const handleYearChange = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/revenue-stats-year/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ year }),
        }
      );
      const data = await response.json();
      setTotalRevenue(data.total_revenue);
      setItems(data.items);
      setMenuItems(data.menu_items);
      setMonthlyStats(data.monthly_stats);
      setError("");
    } catch (err) {
      setError("Lỗi khi lấy dữ liệu thống kê doanh thu.");
      console.error(err);
    }
  };

  return (
    <Container>
      <div>
        <form onSubmit={handleYearChange}>
          <label htmlFor="year">Năm:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
          <button type="submit">Thống kê</button>
        </form>
        {error && <p>{error}</p>}
        {totalRevenue > 0 && (
          <p>
            Tổng doanh thu năm {year}: {totalRevenue} VND
          </p>
        )}
        {items.length > 0 && (
          <div>
            <h2>Thống kê theo món ăn</h2>
            <table>
              <thead>
                <tr>
                  <th>Mã món ăn</th>
                  <th>Tên món ăn</th>
                  <th>Giá món ăn</th>
                  <th>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.food_id}>
                    <td>{item.food_id}</td>
                    <td>{item.food_name}</td>
                    <td>{item.food_price} VND</td>
                    <td>{item.total_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {menuItems.length > 0 && (
          <div>
            <h2>Thống kê theo danh mục món ăn</h2>
            <table>
              <thead>
                <tr>
                  <th>Mã danh mục món ăn</th>
                  <th>Tên danh mục món ăn</th>
                  <th>Tổng doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((menuItem) => (
                  <tr key={menuItem.id}>
                    <td>{menuItem.id}</td>
                    <td>{menuItem.name}</td>
                    <td>{menuItem.total_revenue} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {monthlyStats.length > 0 && (
          <div>
            <h2>Thống kê theo danh mục món ăn</h2>
            <table>
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats.map((monthlyStat) => (
                  <tr key={monthlyStat.month}>
                    <td>{monthlyStat.month}</td>
                    <td>{monthlyStat.total_revenue} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}

export default RevenueStatsYear;
