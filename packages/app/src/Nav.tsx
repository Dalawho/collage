import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link';

export const Nav = ( {width} : {width: number}) => {

    const divStyle = { 
        minWidth: width};

    return(
        <nav className=" text-slate-800 border-gray-200 px-4 sm:px-4 py-2.5" style={width == 0 ? {}: divStyle}>
            <div className="flex justify-between items-center mx-auto px-6 sm:px-2">
            <ul className="font-semibold p-3 mt-2 border-gray-100 flex space-x-5 border-0 dark:border-gray-200">
                <li className="hover:text-amber-600">
                    <Link href='/BNM'>Combine and Mint</Link>
                </li>
                <li className="hover:text-amber-600">
                    <Link href='/Piece'>Buy A Piece</Link>
                </li>
                <li className="hover:text-amber-600">
                    <Link href='/Add'>Add New Art</Link>
                </li>
                <li className="hover:text-amber-600">
                    <Link href='/Create'>Change Layer</Link>
                </li>
                <li className="hover:text-amber-600">
                    <Link href='/Gallery'>Gallery</Link>
                </li>
            </ul>
            <div className="text-2xl sm:text-2xl">
            <ConnectButton showBalance={false} accountStatus="address"/>
            </div>
            </div>
        </nav>
    );
    const d = `we`;
};