<?php

namespace gm\humhub\modules\effects;

use yii\base\Event;

class Events
{
    /**
     * Adds the effects widget to layout addons.
     */
    public static function onLayoutAddonsInit(Event $event): void
    {
        $event->sender->addWidget(widgets\Effects::class);
    }
}
