export default function Custom404() {
    return (
        <div className="pt-[200px]" style={{position: 'absolute', top: '50%', bottom: '0%', left: '50%', transform: "translate(-50%, -50%)"}}>
            <div className="rounded-lg text-center space-y-[1rem]">
                <h3 className="text-2xl md:text-[50px] font-black">404</h3>
                <h3 className="text-lg md:text-[30px] text-orangec">Page Not Found</h3>
            </div>
        </div>
    )
  }