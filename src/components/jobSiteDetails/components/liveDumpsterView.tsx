import { Row, Col, Image } from 'antd'
import AddIcon from '../../../../public/images/add-dumpster-icon.svg'
import DumpsterCard from './liveDumpsterCard'

export default function LiveDumpsterView({
  setDumsterModal,
  liveDumpsterList,
  setLiveDumpsterId,
  disabled,
}: {
  setDumsterModal: (_value: boolean) => void
  liveDumpsterList?: any[]
  setLiveDumpsterId: (_value: number | undefined) => void
  disabled?: boolean
}) {
  return (
    <Row gutter={24}>
      {liveDumpsterList?.map((dumpster, index) => (
        <DumpsterCard
          key={index}
          disabled={disabled}
          dumpster={dumpster}
          setLiveDumpsterId={setLiveDumpsterId}
          setDumsterModal={setDumsterModal}
        />
      ))}
      {!disabled && (
        <Col
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          className={
            liveDumpsterList?.length === 0 ||
            (liveDumpsterList && liveDumpsterList?.length % 3 === 0)
              ? 'mt-0'
              : 'mt-3'
          }
        >
          <div
            className={
              liveDumpsterList?.length === 0 ||
              (liveDumpsterList && liveDumpsterList?.length % 3 === 0)
                ? 'mt-0 ml-0'
                : 'mt-16 ml-5'
            }
            style={{
              width: '340px',
              height: '258px',
              borderRadius: '8px',
              background: '#D9D9D9',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
            onClick={() => {
              setDumsterModal(true)
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#C0C0C0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#D9D9D9')}
          >
            <Image alt="addDumpster" src={AddIcon.src} preview={false} />
          </div>
        </Col>
      )}
    </Row>
  )
}
