'use client'
import type { CollapseProps } from 'antd'
import { Collapse } from 'antd'
import { CollapseIco } from '@/src/components/appicons/icons'

interface CollapseTabProps {
  items: CollapseProps['items']
  className: string
  activeKey?: number | number[]
}

const CollapseTab: React.FC<CollapseTabProps> = ({
  items,
  className,
  activeKey,
}) => {
  return (
    <Collapse
      className={className}
      items={items}
      expandIcon={() => <CollapseIco />}
      defaultActiveKey={activeKey ? activeKey : undefined} // Set the default active key here
    />
  )
}

export default CollapseTab
