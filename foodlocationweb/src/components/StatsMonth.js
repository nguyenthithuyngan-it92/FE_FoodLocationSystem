import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { authAPI, endpoints } from "../configs/API";

function RevenueStatsMonth() {
    const [year, setYear] = useState("")
    const [month, setMonth] = useState("")
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [items, setItems] = useState([])
    const [menuItems, setMenuItems] = useState([])
    const [error, setError] = useState("")

    // Gọi API để lấy dữ liệu thống kê doanh thu
  const handleMonthChange = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch("http://127.0.0.1:8000/revenue-stats-month/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ year, month }),
    });
      const data = await response.json();
      setTotalRevenue(data.total_revenue);
      setItems(data.items);
      setMenuItems(data.menu_items);
      setError("");
    } catch (err) {
      setError("Lỗi khi lấy dữ liệu thống kê doanh thu.");
      console.error(err);
    }
  };

    return (
        <Container>
            <div>
                <form onSubmit={handleMonthChange}>
                    <label htmlFor="year">Năm:</label>
                    <input
                        type="number"
                        id="year"
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                    />
                    <label htmlFor="month">Tháng:</label>
                    <select
                        id="month"
                        value={month}
                        onChange={(event) => setMonth(event.target.value)}
                    >
                        <option value="">Tất cả</option>
                        <option value="1">Tháng 1</option>
                        <option value="2">Tháng 2</option>
                        <option value="3">Tháng 3</option>
                        <option value="4">Tháng 4</option>
                        <option value="5">Tháng 5</option>
                        <option value="6">Tháng 6</option>
                        <option value="7">Tháng 7</option>
                        <option value="8">Tháng 8</option>
                        <option value="9">Tháng 9</option>
                        <option value="10">Tháng 10</option>
                        <option value="11">Tháng 11</option>
                        <option value="12">Tháng 12</option>
                    </select>
                    <button type="submit">Thống kê</button>
                </form>
                {error && <p>{error}</p>}
                {totalRevenue > 0 && (
                    <p>Tổng doanh thu tháng {month}: {totalRevenue} VND</p>
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
                                    <td>{item.quantity}</td>
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
                                    <tr key={menuItem.menu_items}>
                                    <td>{menuItem.id}</td>
                                    <td>{menuItem.name}</td>
                                    <td>{menuItem.total_revenue} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Container>
    )
}

export default RevenueStatsMonth