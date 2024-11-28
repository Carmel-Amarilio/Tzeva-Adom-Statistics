import { useEffect, useState } from "react";
import Autocomplete from '@mui/joy/Autocomplete';
import Chip from '@mui/joy/Chip';
import Close from '@mui/icons-material/Close';


interface prop {
    name: string
    options: { value: number, title: string }[]
    setFilter: (key: string, val: string | number | string[]) => void
    value: string[]
}

export default function MultipleSelection({ name, options, setFilter, value }: prop) {
    const [selectedOptions, setSelectedOptions] = useState([])

    useEffect(() => {
        setSelectedOptions(options.filter(option => value.includes(option.value.toString())))
    }, [value])


    const handleChange = (ev: React.ChangeEvent<{ name?: string }>, newValue) => {
        const selectedValues = newValue.map(({ value }) => value.toString())
        console.log(selectedValues);

        setFilter(name, selectedValues)
    };


    return (
        <Autocomplete
            multiple
            placeholder="Favorites"
            options={options}
            getOptionLabel={(option) => option.title}
            value={selectedOptions}
            onChange={handleChange}
            renderTags={(tags, getTagProps) =>
                tags.map((item, index) => (
                    <Chip
                        variant="solid"
                        color="primary"
                        endDecorator={<Close fontSize="sm" />}
                        sx={{ minWidth: 0 }}

                        {...getTagProps({ index })}
                    >
                        {item.title}
                    </Chip>
                ))
            }

        />
    );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
]
