import Icon from "./../public/logo/icon.jpeg"
import Full from "./../public/logo/full.jpeg"
import Image from "next/image"
import Link from "next/link"

export interface LogoProps {
        iconOnly?: boolean,
        className?: string,
}

const Logo = ({ iconOnly, className }: LogoProps ) => {
	return (
		<Link className={ className } href="/">
			{/* <a> */}
				<Image 
                                        alt="GEM"
					src={ !iconOnly ? Icon : Full }
					width={ !iconOnly ? 32 : 106 }
					height={ 32 }
					className="rounded-sm" />
			{/* </a> */}
		</Link>
	)
} 

export default Logo;