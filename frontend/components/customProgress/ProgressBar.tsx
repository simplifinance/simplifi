import { Progress } from 'antd';

const ProgressBar = (props: {percent: number}) => {
  const { percent } = props;
  return (
      <Progress
        type="circle"
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        trailColor='white'
        percent={percent}
      />
  )
}

export default ProgressBar;
