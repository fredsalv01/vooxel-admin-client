import React from 'react'
// import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { getOrderEmployees, getOrderStatus } from '../lib/helpers'

const recentOrderData = [
    {
        id: '1',
        product_id: '4324',
        customer_id: '23143',
        customer_name: 'Shirley A. Lape',
        order_date: '2022-05-17T03:24:00',
        order_total: '$435.50',
        current_order_status: 'PLACED',
        shipment_address: 'Cottage Grove, OR 97424'
    },
    {
        id: '7',
        product_id: '7453',
        customer_id: '96453',
        customer_name: 'Ryan Carroll',
        order_date: '2022-05-14T05:24:00',
        order_total: '$96.35',
        current_order_status: 'CONFIRMED',
        shipment_address: 'Los Angeles, CA 90017'
    },
    {
        id: '2',
        product_id: '5434',
        customer_id: '65345',
        customer_name: 'Mason Nash',
        order_date: '2022-05-17T07:14:00',
        order_total: '$836.44',
        current_order_status: 'SHIPPED',
        shipment_address: 'Westminster, CA 92683'
    },
    {
        id: '3',
        product_id: '9854',
        customer_id: '87832',
        customer_name: 'Luke Parkin',
        order_date: '2022-05-16T12:40:00',
        order_total: '$334.50',
        current_order_status: 'SHIPPED',
        shipment_address: 'San Mateo, CA 94403'
    },
    {
        id: '4',
        product_id: '8763',
        customer_id: '09832',
        customer_name: 'Anthony Fry',
        order_date: '2022-05-14T03:24:00',
        order_total: '$876.00',
        current_order_status: 'OUT_FOR_DELIVERY',
        shipment_address: 'San Mateo, CA 94403'
    },
    {
        id: '5',
        product_id: '5627',
        customer_id: '97632',
        customer_name: 'Ryan Carroll',
        order_date: '2022-05-14T05:24:00',
        order_total: '$96.35',
        current_order_status: 'DELIVERED',
        shipment_address: 'Los Angeles, CA 90017'
    }
]

const recentEmployeeData = [
    {
        id: 'DNI',
        product_id: '43246457',
        customer_id: '23143',
        customer_name: 'Romero Salas',
        order_date: 'Gian Pier',
        order_total: 'Programmer Front-End',
        current_order_status: 'SENIOR',
        shipment_address: 'Full-Time'
    },
    {
        id: 'CE',
        product_id: '74345653',
        customer_id: '96453',
        customer_name: 'Jackson Smith',
        order_date: 'Veronica',
        order_total: 'Programmer Front-Back',
        current_order_status: 'SEMI-JUNIOR',
        shipment_address: 'Part-Time'
    },
    {
        id: 'DNI',
        product_id: '54354364',
        customer_id: '65345',
        customer_name: 'Morales Linares',
        order_date: 'Edwing',
        order_total: 'Programmer Front-End',
        current_order_status: 'SENIOR',
        shipment_address: 'Full-Time'
    },
    {
        id: 'DNI',
        product_id: '98124654',
        customer_id: '87832',
        customer_name: 'Momoa Di´Caprio',
        order_date: 'Jhonatan',
        order_total: 'Programmer Front-Back',
        current_order_status: 'JUNIOR',
        shipment_address: 'Full-Time'
    },
    {
        id: 'DNI',
        product_id: '87686903',
        customer_id: '09832',
        customer_name: 'Statan',
        order_date: 'Sebastian',
        order_total: 'Programmer Front-Back',
        current_order_status: 'SEMI-JUNIOR',
        shipment_address: 'Full-Time'
    },
    {
        id: 'DNI',
        product_id: '56367827',
        customer_id: '97632',
        customer_name: 'Myller Ross',
        order_date: 'Daniels',
        order_total: 'Programmer BD',
        current_order_status: 'PRACTICANTE',
        shipment_address: 'Part-Time'
    }
]

export default function RecentOrders() {
    return (
        <div className="w-full">
            <div className="flex">
                <div className="bg-white px-4 pt-3 w-full pb-4 rounded-sm border border-gray-200 flex-1">
                    <strong className="text-gray-700 font-medium">Recent Orders</strong>
                    <div className="border-x border-gray-200 rounded-sm mt-3">
                        <table className="w-full text-gray-700">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product ID</th>
                                    <th>Customer Name</th>
                                    <th>Order Date</th>
                                    <th>Order Total</th>
                                    <th>Shipping Address</th>
                                    <th>Order Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrderData.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <Link to={`/order/${order.id}`}>#{order.id}</Link>
                                        </td>
                                        <td>
                                            <Link to={`/product/${order.product_id}`}>#{order.product_id}</Link>
                                        </td>
                                        <td>
                                            <Link to={`/customer/${order.customer_id}`}>{order.customer_name}</Link>
                                        </td>
                                        {/* <td>{format(new Date(order.order_date), 'dd MMM yyyy')}</td> */}
                                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                        <td>{order.order_total}</td>
                                        <td>{order.shipment_address}</td>
                                        <td>{getOrderStatus(order.current_order_status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div>
                <div className="bg-white px-4 pt-3 w-full pb-4 rounded-sm border border-gray-200 flex-1 mt-5">
                    <strong className="text-gray-700 font-medium">Recent Employees</strong>
                    <div className="border-x border-gray-200 rounded-sm mt-3">
                        <table className="w-full text-gray-700">
                            <thead>
                                <tr>
                                    <th>Type of ID</th>
                                    <th>ID</th>
                                    <th>Last Name</th>
                                    <th>Names</th>
                                    <th>Position</th>
                                    <th>Contract</th>
                                    <th>Superior leader</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentEmployeeData.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <Link to={`/order/${order.id}`}>{order.id}</Link>
                                        </td>
                                        <td>
                                            <Link to={`/product/${order.product_id}`}>{order.product_id}</Link>
                                        </td>
                                        <td>
                                            <Link to={`/customer/${order.customer_id}`}>{order.customer_name}</Link>
                                        </td>
                                        {/* <td>{format(new Date(order.order_date), 'dd MMM yyyy')}</td> */}
                                        <td>
                                            <Link to={`/customer/${order.order_date}`}>{order.order_date}</Link>
                                        </td>
                                        <td>{order.order_total}</td>
                                        <td>{order.shipment_address}</td>
                                        <td>{getOrderEmployees(order.current_order_status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
