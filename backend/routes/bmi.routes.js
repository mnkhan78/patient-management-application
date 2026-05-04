const express = require('express');
const router = express.Router();

const getWHOReference = require('../utils/getWHOReference');

router.post('/child-bmi', async (req, res) => {
    try {
        const { weight, height, age, gender } = req.body;

        // validation
        if (!weight || !height || !age || !gender) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // step 1: BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        // step 2: age in months
        const ageInMonths = Math.round(age * 12);

        // step 3: get WHO LMS reference
        const ref = getWHOReference(ageInMonths, gender);

        if (!ref) {
            return res.status(404).json({ error: "Age data not found" });
        }

        const { L, M, S } = ref;

        // step 4: calculate Z-score
        let z;

        if (L === 0) {
            z = Math.log(bmi / M) / S;
        } else {
            z = (Math.pow(bmi / M, L) - 1) / (L * S);
        }

        // step 5: classification (WHO standard)
        let status = "";

        if (z < -2) status = "Underweight";
        else if (z >= -2 && z <= 1) status = "Normal";
        else if (z > 1 && z <= 2) status = "Overweight";
        else status = "Obese";

        res.json({
            bmi: bmi.toFixed(2),
            zScore: z.toFixed(2),
            ageInMonths,
            status,
            reference: {
                L,
                M,
                S
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

module.exports = router;