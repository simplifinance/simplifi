// import { Progress } from 'antd';
import Typography from '@mui/material/Typography'

const ProgressBar = (props: {percent: number}) => {
  const { percent } = props;
  return (
    <>
      {/* <Progress
        type="circle"
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        trailColor='white'
        percent={percent}
        // style={{color: lightMode? '#108ee9' : '#fff'}}
        style={{color: '#fff'}}
      /> */}
      <Typography variant={"body1"}>Progess update</Typography>
    </>
  )
}

export default ProgressBar;
