import '../../style/dashboard.css'

const PatientSearch = ({searchQuery, setSearchQuery, setPage}) => {
    return (
        <div>
            <input className="patient-search-input"
            type="text" 
            placeholder="search..."
            value={searchQuery}
            onChange={(e) => {setPage(1); setSearchQuery(e.target.value)}}/>
        </div>
    )
}

export default PatientSearch;