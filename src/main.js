import Vue from 'vue';
import './style.scss';
import genres from './util/genres';

new Vue({
    el: '#app',
    data: {
        genre: [],
        time: []
    },
    // adds event to root instance
    methods: {
        checkFilter(category, title, checked) {
            // if filter is checked, add to array
            if (checked) {
                this[category].push(title);
            } else {
                let index = this[category].indexOf(title);
                if (index > -1) {
                    // if it's in the array, delete 1 item
                    this[category].splice(index, 1);
                }
            }
        }
    },
    components: {
        'movie-list': {
            template: `<div id="movie-list">
                            <div class="movie" v-for="movie in filteredMovies">{{ movie.title }}</div>
                        </div>`,
            // data in components needs to be a function because it can be reused, 
            data() {
                return {
                    movies: [
                        { title: 'Home Alone', genre: genres.COMEDY },
                        { title: 'Pulp Fiction', genre: genres.CRIME },
                        { title: 'Austin Powers', genre: genres.COMEDY }
                    ]
                };
            },
            props: ['genre', 'time'],
            methods: {
                // callback function
                moviePassesGenreFilter(movie) {
                    // if genre array is empty (aka no filter selected) show all movies
                    if (!this.genre.length) {
                        return true;
                    } else {
                        // find method, loop through genre array
                        return this.genre.find(genre => movie.genre === genre);
                    }
                }
            },
            // computed property because genre and time are reactive, so as those are set, computed property gets updated 
            computed: {
                filteredMovies() {
                    return this.movies.filter(this.moviePassesGenreFilter);
                }
            }
        },
        //parent component
        'movie-filter': {
            data() {
                return {
                    genres
                }
            },
            template: `<div id="movie-filter">
                            <h2>Filter Results</h2>
                            <div class="filter-group">
                                <check-filter v-for="genre in genres" v-bind:title="genre" v-on:check-filter="checkFilter"></check-filter>
                            </div>
                        </div>`,
            methods: {
                checkFilter(category, title, checked) {
                    // same name but different event - emits event from child component
                    this.$emit('check-filter', category, title, checked);
                }
            },
            components: {
                // child component
                'check-filter': {
                    data() {
                        return {
                            checked: false
                        }
                    },
                    props: [ 'title' ],
                    // turn class into an object, assign active class if checked
                    template: `<div v-bind:class="{ 'check-filter': true, active: checked }">
                                   <span class="checkbox" v-on:click="checkFilter"></span>
                                   <span class="check-filter-title">{{ title }}</span>
                               </div>`,
                    methods: {
                        checkFilter() {
                            this.checked = !this.checked;
                            this.$emit('check-filter', 'genre', this.title, this.checked);
                        }
                    }
                }
            }
        }
    },
});