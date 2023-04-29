import Card from './DetailsCard'
import Table from 'components/basetable'
import TableWrapper from 'components/TableWrapper-noMinHeightbase'
const HistoryCard = ({tableData, columns}) => {
	return (		
		<TableWrapper error={false}>
			{tableData ? (
			<Table loading={false} tableData={tableData} columns={columns} pageSize={10} />
			) : (
				'No Data Available'
			)}
		</TableWrapper>		
	)
}

export default HistoryCard
