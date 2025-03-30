import { Outlet } from "react-router-dom";
import Layout from "../Layout";
import { MotionDivWrap } from "../utilities/common/MotionDivWrap";

export default function AppFeatures() {
    return(
        <Layout>
            <MotionDivWrap className={`minHeight bg-white1 dark:bg-gray1 md:rounded-[36px] border border-green1/30 dark:border-gray1 p-4 relative`}>
                <Outlet />
            </MotionDivWrap>
        </Layout>
    );
}