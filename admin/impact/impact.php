<?php

namespace Compassionate_Comments\Admin\Impact;

/*
 * re-calculate stats every time comment is published
 * but return early if it hasn't been 5 minutes, to avoid perf issues
 * er, maybe need more advanced logic, like throttle/debounce.
 *      don't wanna create situation where comment is published, then 4 min later another one is published so it's not updated,
 *      but then the next comment doesn't come in for days/weeks, so stats never include the last comment
 *      maybe if there was one w/in the last 5 min, schedule single cron event for 5 min from now and then return early
 *          when doing that, make sure there isn't another one already scheduled. if there is then don't schedule one
 *          that way it'll definitely be re-calced in max 5 minutes no matter what, but won't happen back-to-back on high-comment sites
 * maybe simpler to just have a cron job every 5 minutes? but then admin might notice when testing and be confused
 */