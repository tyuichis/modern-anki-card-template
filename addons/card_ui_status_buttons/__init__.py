# modern-anki-card-template
# Copyright (C) 2025 Tommy Yuichi Siek

# This file is part of modern-anki-card-template.
# Licensed under the AGPL-3.0 License.
# See the LICENSE file in the project root for details.

from aqt import mw, gui_hooks
from aqt.reviewer import Reviewer
import logging
from typing import List, Union, Optional, Tuple, Any

logging.basicConfig(level=logging.DEBUG)  # Set basic logging, adjust level as needed

def set_card_flag(card_ids: Union[int, List[int]], flag_value: int = 0) -> None:
    """Sets a flag on one or more cards.

    Args:
        card_ids: A single card ID or a list/tuple of card IDs.
        flag_value: The flag value to set (0-7).
    """
    if not card_ids:
        logging.warning("set_card_flag called with no card IDs.")
        return

    if isinstance(card_ids, int):
        card_ids = [card_ids]

    try:
        mw.col.set_user_flag_for_cards(flag_value, card_ids)
        mw.reset()  # Refresh the interface to reflect changes
        logging.info(f"Set flag {flag_value} on cards: {card_ids}")
    except Exception as e:
        logging.error(f"Error setting flag: {e}", exc_info=True)

def get_card_flag(card_id: Optional[int] = None) -> Optional[int]:
    """Returns the flag status of a card.

     Args:
        card_id: The ID of the card to get the flag status for.

    Returns:
         The flag status (0-7) or None if the card is not found or there's an error.
    """
    if card_id is None:
        logging.debug("get_card_flag called with no card_id")
        return None

    try:
        card = mw.col.get_card(card_id)
        if card:
            return card.user_flag()
        else:
           logging.debug(f"card not found with id: {card_id}")
           return None
    except Exception as e:
      logging.error(f"Error getting card flag: {e}", exc_info=True)
      return None

def on_js_message(handled: Tuple[bool, Any], js_message: str, context: Any) -> Tuple[bool, Any]:
    """Handles messages from the webview.

    Args:
        handled: (bool, Any) Tuple, indicating if a previous handler processed the message
        js_message: The message received from the webview.
        context: The context of the message (e.g., Reviewer object)

    Returns:
        (bool, Any): Tuple, indicating if the message is handled and the result.
    """

    if not isinstance(context, Reviewer):
        return handled

    COMMANDS = {
        "go_home",
        "undo_card",
        "pass_card",
        "fail_card",
        "get_flag_status",
    }

    if js_message not in COMMANDS and not js_message.startswith("set_flag_"):
        return handled

    card = mw.reviewer.card
    if not card:
        logging.warning("No card found in reviewer.")
        return False, "No card in reviewer"
    logging.debug(f"Card from reviewer: {card.id}")

    user_flag = card.user_flag() # since 2.1.50 userFlag -> user_flag
    logging.debug(f"user_flag: {user_flag} for card {card.id}")

    if js_message == "go_home":
        logging.info("Going home...")
        mw.moveToState("deckBrowser")
        return True, None

    if js_message == "undo_card":
        try:
            mw.col.undo()
            mw.reset()
            return True, None
        except Exception as e:
            logging.error(f"Error handling undo: {e}", exc_info=True)
            return False, f"Error handling undo: {e}"

    if js_message == "pass_card":
        if mw.reviewer.state == "answer":
            try:
                mw.reviewer.answer_card(3)  # 3 for pass
                return True, None
            except Exception as e:
                 logging.error(f"Error passing card: {e}", exc_info=True)
                 return False, f"Error passing card: {e}"
        else:
            logging.warning("No card to answer.")
            return False, "No card to answer"

    if js_message == "fail_card":
        if mw.reviewer.state == "answer":
            try:
                mw.reviewer._answerCard(1)  # 1 for fail
                return True, None
            except Exception as e:
                 logging.error(f"Error failing card: {e}", exc_info=True)
                 return False, f"Error failing card: {e}"
        else:
            logging.warning("No card to answer.")
            return False, "No card to answer"

    if js_message == "get_flag_status":
        if user_flag is not None:  # Ensure user_flag is a valid number
             return True, int(user_flag)  # user_flag should be 0–7 as of Anki version 24.11
        else:
             logging.warning("Flag status is None or invalid.")
             return True, 0  # Default to unflagged

    if js_message.startswith("set_flag_"):
        try:
            flag_str = js_message.split("_")[-1]
            if not flag_str.isdigit():
                logging.warning(f"Invalid flag value received: {flag_str}")
                return False, "Invalid flag value"

            flag_value = int(flag_str)
            min_flag_value = 0
            max_flag_value = 7

            if not (min_flag_value <= flag_value <= max_flag_value):
                logging.warning(f"Flag value out of range: {flag_value}")
                return False, "Flag value out of range"

            # Toggle if a flag is already present
            # set_card_flag(card.id, flag_value if user_flag == 0 else 0)
            set_card_flag(card.id, flag_value)
            return True, flag_value
        except Exception as e:
            logging.error(f"Error setting flag: {e}", exc_info=True)
            return False, f"Error: {str(e)}"

    return handled  # Return handled if not processed

gui_hooks.webview_did_receive_js_message.append(on_js_message)
