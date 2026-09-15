import { useState } from "react";
import api from "../api/axios";
import "../style/updateModal.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


// =====================================================
// SORTABLE MEDICINE ROW
// =====================================================

const SortableMedicineRow = ({
  medicine,
  index,
  handleMedicineChange,
}) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: `medicine-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="medicine-row"
    >

      {/* Drag Handle */}
      <button
        type="button"
        className="medicine-drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Move medicine"
      >
        ⋮⋮
      </button>


      {/* Medicine Name */}
      <input
        type="text"
        name="name"
        value={medicine.name}
        onChange={(e) => handleMedicineChange(index, e)}
        placeholder="Medicine Name"
      />


      {/* Dosage */}
      <input
        type="text"
        name="dosage"
        value={medicine.dosage}
        onChange={(e) => handleMedicineChange(index, e)}
        placeholder="Dosage"
      />


      {/* Frequency */}
      <input
        type="text"
        name="frequency"
        value={medicine.frequency}
        onChange={(e) => handleMedicineChange(index, e)}
        placeholder="Frequency"
      />

    </div>
  );
};


// =====================================================
// UPDATE APPOINTMENT MODAL
// =====================================================

const UpdateAppointmentModal = ({ appointment, onClose }) => {

  const [formData, setFormData] = useState(() => appointment);


  // =====================================================
  // DND SENSORS
  // =====================================================

  const sensors = useSensors(

    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })

  );


  // =====================================================
  // NORMAL FIELD CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =====================================================
  // VITALS CHANGE
  // =====================================================

  const handleVitalsChange = (e) => {

    const { name, value } = e.target;

    if (name === "systolic" || name === "diastolic") {

      setFormData({
        ...formData,

        vitals: {
          ...formData.vitals,

          bp: {
            ...formData.vitals.bp,
            [name]: value,
          },
        },
      });

    } else {

      setFormData({
        ...formData,

        vitals: {
          ...formData.vitals,
          [name]: value,
        },
      });

    }

  };


  // =====================================================
  // MEDICINE CHANGE
  // =====================================================

  const handleMedicineChange = (index, e) => {

    const { name, value } = e.target;

    const updatedMedicines = [
      ...formData.medicinesPrescribed,
    ];

    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [name]: value,
    };

    setFormData({
      ...formData,
      medicinesPrescribed: updatedMedicines,
    });

  };


  // =====================================================
  // ADD MEDICINE
  // =====================================================

  const addMedicine = () => {

    setFormData({
      ...formData,

      medicinesPrescribed: [
        ...(formData.medicinesPrescribed || []),

        {
          name: "",
          dosage: "",
          frequency: "",
        },
      ],
    });

  };


  // =====================================================
  // DRAG END
  // =====================================================

  const handleMedicineDragEnd = ({ active, over }) => {

    if (!over) return;

    if (active.id === over.id) return;


    const oldIndex = Number(
      active.id.replace("medicine-", "")
    );

    const newIndex = Number(
      over.id.replace("medicine-", "")
    );


    setFormData((prev) => ({

      ...prev,

      medicinesPrescribed: arrayMove(
        prev.medicinesPrescribed,
        oldIndex,
        newIndex
      ),

    }));

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.patch(
        `/appointments/${formData._id}`,
        formData
      );

      alert("Appointment updated successfully ✅");

      onClose();

      window.location.reload();

    } catch (error) {

      console.error(
        "Error updating appointment:",
        error
      );

      alert("Update failed ❌");

    }

  };


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="modal-overlay">

      <div className="modal-container">

        <h2>Update Appointment</h2>


        <form
          className="appointment-form"
          onSubmit={handleSubmit}
        >


          {/* =================================================
              MEDICINES
          ================================================= */}

          <h4>Medicines</h4>


          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleMedicineDragEnd}
          >

            <SortableContext
              items={
                formData.medicinesPrescribed?.map(
                  (_, index) => `medicine-${index}`
                ) || []
              }
              strategy={verticalListSortingStrategy}
            >

              {formData.medicinesPrescribed?.map(
                (medicine, index) => (

                  <SortableMedicineRow
                    key={`medicine-${index}`}
                    medicine={medicine}
                    index={index}
                    handleMedicineChange={
                      handleMedicineChange
                    }
                  />

                )
              )}

            </SortableContext>

          </DndContext>


          {/* =================================================
              ADD MEDICINE
          ================================================= */}

          <button
            type="button"
            className="secondary-btn"
            onClick={addMedicine}
          >
            + Add Medicine
          </button>


          {/* =================================================
              INVESTIGATIONS
          ================================================= */}

          <div>

            <label htmlFor="investigations">
              <strong>Investigations:</strong>
            </label>

            <textarea
              id="investigations"
              name="investigations"
              value={formData.investigations}
              onChange={handleChange}
              className="doctor-notes-textarea"
            />

          </div>


          {/* =================================================
              ADVICE
          ================================================= */}

          <div>

            <label htmlFor="advice">
              <strong>Advice:</strong>
            </label>

            <textarea
              id="advice"
              name="advice"
              value={formData.advice}
              onChange={handleChange}
              className="doctor-notes-textarea"
            />

          </div>


          {/* =================================================
              FOLLOW UP
          ================================================= */}

          <div className="followup-date">

            <label htmlFor="followUpDate">
              <strong>Follow-up Date:</strong>
            </label>

            <input
              type="datetime-local"
              name="followUpDate"
              value={
                formData.followUpDate
                  ? new Date(formData.followUpDate)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleChange}
            />

          </div>


          {/* =================================================
              PHARMACY NOTES
          ================================================= */}

          <h4>Pharmacy Notes</h4>

          <textarea
            name="pharmacyNotes"
            value={formData.pharmacyNotes}
            onChange={handleChange}
            placeholder="Pharmacy notes"
          />


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="modal-actions">

            <button
              type="submit"
              className="primary-btn"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={onClose}
              className="secondary-btn"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>

  );

};

export default UpdateAppointmentModal;