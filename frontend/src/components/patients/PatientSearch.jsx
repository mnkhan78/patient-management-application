import '../../style/dashboard.css'

const PatientSearch = ({searchQuery, setSearchQuery}) => {
    return (
        <div>
            <input className="patient-search-input"
            type="text" 
            placeholder="search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}/>
        </div>
    )
}

export default PatientSearch;