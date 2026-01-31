/**
 * TEST FILE - Verify client curriculum is generating correctly
 * Run this in browser console to test
 */

import { getAllClientCourses } from './client-curriculum';

const courses = getAllClientCourses();
console.log('=== CLIENT CURRICULUM TEST ===');
console.log('Total courses:', courses.length);

if (courses.length > 0) {
    const course = courses[0];
    console.log('\nCourse:', course.title);
    console.log('Modules:', course.modules.length);

    if (course.modules.length > 0) {
        const module = course.modules[0];
        console.log('\nFirst Module:', module.title);
        console.log('Lessons in module:', module.lessons.length);

        if (module.lessons.length > 0) {
            const lesson = module.lessons[0];
            console.log('\nFirst Lesson:', lesson.title);
            console.log('Content length:', lesson.content_markdown.length);
            console.log('Content preview:', lesson.content_markdown.substring(0, 200));
            console.log('Video URL:', lesson.video_url);
        }
    }
}

export { };
