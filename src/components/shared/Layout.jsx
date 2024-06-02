import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout() {
	return (
		<div>
			<Sidebar />
			<div className="flex flex-col flex-1 ml-60">
				<Navbar />
				<div className="flex justify-center p-4 overflow-auto">
					<Outlet />
				</div>
			</div>
		</div>
	)
}