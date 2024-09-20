import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import React, { useEffect, useState } from "react";
import Select from 'react-select';
import Cookies from 'js-cookie';

export default function UpdatePreferences({ status, className = '', userId}) {
    const user = usePage().props.auth.user;
    userId = user.id;

    const [sources, setSources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);

    const { data, setData, error, patch, recentlySuccessful } = useForm({
        sources: [],
        categories: [],
        authors: [],
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlysuccessful, setRecentlySuccessful] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/get_prefrences'); // Ensure this is the correct endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                
                setSources(result.sources || []);
                setCategories(result.categories || []);
                setAuthors(result.authors || []);
                
                setData('sources', result.selectedSources || []);
                setData('categories', result.selectedCategories || []);
                setData('authors', result.selectedAuthors || []);
            } catch (error) {
                console.error('Error fetching preferences:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUserPreferences = async () => {
            const response = await fetch(`/user/preferences?id=${userId}`);
            if (!response.ok) {
                console.error('Failed to fetch user preferences');
                return;
            }
            const preferences = await response.json();
            setData({
                sources: preferences.sources || [],
                categories: preferences.categories || [],
                authors: preferences.authors || [],
            });
        };

        fetchUserPreferences();
    }, [userId]);

    const handleChange = (e, field) => {
        setData(field, Array.from(e.target.selectedOptions, option => option.value));
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});


        const formData = {
            ...user,
            sources_prefrences: data.sources,
            categories_prefrences: data.categories,
            authors_prefrences: data.authors,
        };

        try {
            const response = await fetch('/api/update_preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'validate_csrf_token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'), // Add CSRF token if needed
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setRecentlySuccessful(true);
                setErrors({});
                setData({
                    sources: [],
                    categories: [],
                    authors: [],
                });
            } else {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
            }
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setProcessing(false);
        }
    };

    const sourceOptions = sources.map(source => ({ value: source, label: source }));
    const categoryOptions = categories.map(category => ({ value: category, label: category }));
    const authorOptions = authors.map(author => ({ value: author, label: author }));

    const handleSourcesChange = (selected) => {
        const values = selected ? selected.map(item => item.value) : [];
        setData({ ...data, sources: values });
        handleChange({ target: { value: values } }, 'sources');
    };

    const handleCategoriesChange = (selected) => {
        const values = selected ? selected.map(item => item.value) : [];
        setData({ ...data, categories: values });
        handleChange({ target: { value: values } }, 'categories');
    };

    const handleAuthorsChange = (selected) => {
        const values = selected ? selected.map(item => item.value) : [];
        setData({ ...data, authors: values });
        handleChange({ target: { value: values } }, 'authors');
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your preferences including sources, categories, and authors.
                </p>
            </header>

            <form onSubmit={submit} method='POST' className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="sources" value="Sources" />
                    
                    <Select
                        id="sources"
                        isMulti
                        options={sourceOptions}
                        value={sourceOptions.filter(option => data.sources.includes(option.value))}
                        onChange={handleSourcesChange}
                        className="mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.sources} />
                </div>

                <div>
                    <InputLabel htmlFor="categories" value="Categories" />
                    
                    <Select
                        id="categories"
                        isMulti
                        options={categoryOptions}
                        value={categoryOptions.filter(option => data.categories.includes(option.value))}
                        onChange={handleCategoriesChange}
                        className="mt-1 block w-full"
                    />

                    <InputError className="mt-2" message={errors.categories} />
                </div>

                <div>
                    <InputLabel htmlFor="authors" value="Authors" />
                    
                    <Select
                        id="authors"
                        isMulti
                        options={authorOptions}
                        value={authorOptions.filter(option => data.authors.includes(option.value))}
                        onChange={handleAuthorsChange}
                        className="mt-1 block w-full"
                    />
                    <InputError className="mt-2" message={errors.authors} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
