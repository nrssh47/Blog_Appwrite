import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="bg-gradient-to-t from-white to-slate-50 border-t mt-10 py-12 text-sm text-slate-600">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold text-indigo-700 mb-2">MegaBlog+</h4>
            <p className="text-sm">© 2025 MegaBlog. All rights reserved.</p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Product</h5>
            <ul className="space-y-1">
              <li>Features</li>
              <li>Integrations</li>
              <li>Pricing</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Company</h5>
            <ul className="space-y-1">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Legal</h5>
            <ul className="space-y-1">
              <li>Terms</li>
              <li>Privacy</li>
              <li>Cookies</li>
              <li>Licensing</li>
            </ul>
          </div>
        </div>
      </footer>
  )
}

export default Footer